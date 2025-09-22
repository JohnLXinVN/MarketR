import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, DataSource, MoreThan } from 'typeorm';
import { Deposit, DepositStatus } from './entities/deposit.entity';
import { User } from '../user/user.entity'; // Đảm bảo đường dẫn này đúng
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { z } from 'zod';
import BigNumber from 'bignumber.js';
import {
  PaymentAddress,
  AddressStatus,
} from './entities/payment-address.entity';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from 'src/events/events.gateway';

// Ngưỡng xác thực
const MIN_CONFIRMATIONS = {
  btc: 2,
  ltc: 6,
  usdt: 20, // TRON cần khoảng 20 block để được coi là không thể đảo ngược
};

const DEPOSIT_RULES = {
  MIN_DEPOSIT_USD: 50,
  PENALTY_USD: 5,
  BONUS_TIERS: [
    { min: 1500, bonus: 0.15 },
    { min: 500, bonus: 0.1 },
    { min: 200, bonus: 0.05 },
  ],
};

// Địa chỉ hợp đồng USDT trên mạng TRON (TRC20)
const USDT_TRC20_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const ADDRESS_LOCK_DURATION_MS = 10 * 60 * 1000;

// --- Xác thực Schema Zod ---
const BlockCypherTxSchema = z.object({
  hash: z.string(),
  outputs: z.array(
    z.object({
      // BlockCypher đôi khi trả number, nhưng an toàn nếu chúng ta chấp nhận cả string
      value: z.union([z.number(), z.string()]),
      addresses: z.array(z.string()).optional(),
    }),
  ),
});
const BlockCypherAddressSchema = z.object({
  txs: z.array(BlockCypherTxSchema).optional(),
});
const TronGridTxSchema = z.object({
  transaction_id: z.string(),
  value: z.union([z.string(), z.number()]),
});

const TronGridResponseSchema = z.object({
  data: z.array(TronGridTxSchema).optional(),
});

const BinancePriceSchema = z.object({ price: z.string() });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private axiosInstance: AxiosInstance;
  private blockcypherToken?: string;
  private trongridApiKey?: string;
  private eventsGateway: EventsGateway;

  constructor(
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
    @InjectRepository(PaymentAddress)
    private paymentAddressRepository: Repository<PaymentAddress>,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    this.axiosInstance = axios.create({ timeout: 10000 });
    // add retry (mình đã có axiosRetry import ở trên)
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: (retryCount) => Math.min(2000 * retryCount, 10000), // linear backoff cap
      retryCondition: (error) => {
        const status: number = error.response?.status ?? 0; // luôn là number

        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          status >= 500 ||
          status === 429
        );
      },
    });
  }

  onModuleInit() {
    this.blockcypherToken = this.configService.get<string>(
      'BLOCKCYPHER_API_TOKEN',
    );
    this.trongridApiKey = this.configService.get<string>('TRONGRID_API_KEY');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async masterCronJob() {
    this.logger.log('--- Running Master Deposit Cycle ---');
    await this.scanLockedAddressesForNewTx();
    await this.scanPendingDepositsForConfirmation();
    await this.safelyReleaseExpiredLocks();
    this.logger.log('--- Master Deposit Cycle Finished ---');
  }

  private async scanLockedAddressesForNewTx() {
    const lockedAddresses = await this.paymentAddressRepository.find({
      where: {
        status: AddressStatus.LOCKED,
        lockExpiresAt: MoreThan(new Date()),
      },
    });

    for (const pAddress of lockedAddresses) {
      try {
        const newTransactions =
          await this.checkForNewTransactionsOnAddress(pAddress);

        if (newTransactions.length > 0) {
          await this.processNewTransactions(pAddress, newTransactions);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        this.logger.error(
          `Error scanning address ${pAddress.address}: ${errorMessage}`,
        );
      }
    }
  }

  private async safelyReleaseExpiredLocks() {
    const expiredLocks = await this.paymentAddressRepository.find({
      where: {
        status: AddressStatus.LOCKED,
        lockExpiresAt: LessThan(new Date()),
      },
    });

    for (const pAddress of expiredLocks) {
      try {
        const lastMinuteTxs =
          await this.checkForNewTransactionsOnAddress(pAddress);

        if (lastMinuteTxs.length > 0) {
          this.logger.log(
            `Found ${lastMinuteTxs.length} last-minute tx(s) for expired lock on ${pAddress.address}`,
          );
          await this.processNewTransactions(pAddress, lastMinuteTxs);
        } else {
          await this.paymentAddressRepository.update(
            { id: pAddress.id },
            {
              status: AddressStatus.AVAILABLE,
              lockedByUserId: null,
              lockExpiresAt: null,
            },
          );
        }
      } catch (error) {
        this.logger.error(
          `Error during safe release for address ${pAddress.address}: ${error.message}`,
        );
      }
    }
  }

  private async processNewTransactions(
    pAddress: PaymentAddress,
    transactions: { hash: string; amount: number }[],
  ) {
    if (!pAddress.lockedByUserId) return;

    for (const txData of transactions) {
      const existingDeposit = await this.depositRepository.findOneBy({
        transactionHash: txData.hash,
      });
      if (existingDeposit) continue;

      const deposit = this.depositRepository.create({
        userId: pAddress.lockedByUserId,
        currency: pAddress.currency,
        depositAddress: pAddress.address,
        status: DepositStatus.PENDING_CONFIRMATION,
        transactionHash: txData.hash,
        amountCrypto: txData.amount,
      });
      await this.depositRepository.save(deposit);
      this.logger.log(`New deposit record created for tx ${txData.hash}.`);
    }

    // Mở khóa địa chỉ sau khi tất cả giao dịch đã được ghi nhận
    await this.paymentAddressRepository.update(
      { id: pAddress.id },
      {
        status: AddressStatus.AVAILABLE,
        lockedByUserId: null,
        lockExpiresAt: null,
      },
    );
  }

  private async scanPendingDepositsForConfirmation() {
    const pendingDeposits = await this.depositRepository.find({
      where: { status: DepositStatus.PENDING_CONFIRMATION },
    });
    for (const deposit of pendingDeposits) {
      try {
        await this.checkConfirmations(deposit);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        this.logger.error(
          `Failed to check confirmations for deposit ${deposit.id}: ${errorMessage}`,
        );
      }
    }
  }

  private async checkForNewTransactionsOnAddress(
    pAddress: PaymentAddress,
  ): Promise<{ hash: string; amount: number }[]> {
    switch (pAddress.currency) {
      case 'btc':
      case 'ltc':
        return this.checkBlockCypherNewTransactions(
          pAddress.address,
          pAddress.currency as 'btc' | 'ltc',
        );
      case 'usdt':
        if (pAddress.lockExpiresAt) {
          return this.checkTronGridNewTransactions(
            pAddress.address,
            pAddress.lockExpiresAt,
          );
        }
        return [];
      default:
        return [];
    }
  }

  private async checkConfirmations(deposit: Deposit) {
    switch (deposit.currency) {
      case 'btc':
      case 'ltc':
        return this.checkBlockCypherConfirmations(deposit);
      case 'usdt':
        return this.checkTronGridConfirmations(deposit);
    }
  }

  private async checkBlockCypherNewTransactions(
    address: string,
    currency: 'btc' | 'ltc',
  ): Promise<{ hash: string; amount: number }[]> {
    const network = currency === 'btc' ? 'btc/main' : 'ltc/main';
    const url = `https://api.blockcypher.com/v1/${network}/addrs/${address}/full`;
    const { data } = await this.axiosInstance.get(url, {
      params: { token: this.blockcypherToken },
    });

    const parsedData = BlockCypherAddressSchema.parse(data);

    if (!parsedData.txs || parsedData.txs.length === 0) {
      return [];
    }

    if (parsedData.txs!.length > 0) {
      const receivedTxs = parsedData.txs.filter((t) =>
        t.outputs.some((o) => o.addresses?.includes(address)),
      );
      return receivedTxs.map((tx) => {
        const amountInSatoshis = tx.outputs
          .filter((o) => o.addresses?.includes(address))
          .reduce(
            (sum, o) => sum.plus(new BigNumber(o.value)),
            new BigNumber(0),
          );

        return {
          hash: tx.hash,
          amount: amountInSatoshis.dividedBy(1e8).toNumber(),
        };
      });
    }
    return [];
  }

  private async checkTronGridNewTransactions(
    address: string,
    lockExpiresAt: Date,
  ): Promise<{ hash: string; amount: number }[]> {
    const lockStartTime =
      new Date(lockExpiresAt).getTime() - ADDRESS_LOCK_DURATION_MS;
    const url = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20`;
    const { data } = await this.axiosInstance.get(url, {
      headers: { 'TRON-PRO-API-KEY': this.trongridApiKey },
      params: {
        only_to: true,
        contract_address: USDT_TRC20_CONTRACT_ADDRESS,
        limit: 200,
        min_timestamp: lockStartTime,
      },
    });

    if (data?.data?.length > 0) {
      return data.data.map((tx) => ({
        hash: tx.transaction_id,
        amount: new BigNumber(tx.value).dividedBy(1e6).toNumber(),
      }));
    }
    return [];
  }

  private async checkBlockCypherConfirmations(deposit: Deposit) {
    const network = deposit.currency === 'btc' ? 'btc/main' : 'ltc/main';
    const url = `https://api.blockcypher.com/v1/${network}/txs/${deposit.transactionHash}`;
    const { data } = await this.axiosInstance.get(url, {
      params: { token: this.blockcypherToken },
    });
    if (data?.confirmations >= MIN_CONFIRMATIONS[deposit.currency]) {
      await this.approveDeposit(deposit, data.confirmations);
    }
  }

  private async checkTronGridConfirmations(deposit: Deposit) {
    const url = `https://api.trongrid.io/wallet/gettransactioninfobyid`;
    const txInfoResponse = await this.axiosInstance.post(
      url,
      { value: deposit.transactionHash },
      { headers: { 'TRON-PRO-API-KEY': this.trongridApiKey } },
    );
    const txInfo = txInfoResponse.data;
    if (!txInfo?.blockNumber) return; // chưa mined
    // lấy latest block (solidity)
    const latestBlockResponse = await this.axiosInstance.get(
      'https://api.trongrid.io/walletsolidity/getnowblock',
      { headers: { 'TRON-PRO-API-KEY': this.trongridApiKey } },
    );
    const latestBlock =
      latestBlockResponse?.data?.block_header?.raw_data?.number ??
      latestBlockResponse?.data?.block?.header?.raw_data?.number;
    if (typeof latestBlock !== 'number') return;
    const confirmations = latestBlock - txInfo.blockNumber;
    if (confirmations >= MIN_CONFIRMATIONS.usdt) {
      await this.approveDeposit(deposit, confirmations);
    }
  }

  private async getUsdPrice(currency: string): Promise<number> {
    if (currency.toLowerCase() === 'usdt') return 1;
    try {
      const symbol = `${currency.toUpperCase()}USDT`;
      const url = `https://api.binance.com/api/v3/ticker/price`;
      const { data } = await this.axiosInstance.get(url, {
        params: { symbol },
      });
      if (data?.price) return parseFloat(data.price);
      throw new Error(`Invalid data from Binance API for symbol ${symbol}`);
    } catch (error) {
      this.logger.error(
        `Could not fetch price for ${currency}: ${error.message}. Falling back to 1:1 rate.`,
      );
      return 1;
    }
  }

  private async approveDeposit(deposit: Deposit, confirmations: number) {
    const usdPrice = await this.getUsdPrice(deposit.currency);
    const amountUSD = deposit.amountCrypto * usdPrice;

    let creditedAmountUSD = amountUSD;
    if (amountUSD > 0 && amountUSD < DEPOSIT_RULES.MIN_DEPOSIT_USD) {
      creditedAmountUSD -= DEPOSIT_RULES.PENALTY_USD;
      if (creditedAmountUSD < 0) creditedAmountUSD = 0;
    } else {
      const matchedTier = DEPOSIT_RULES.BONUS_TIERS.find(
        (tier) => amountUSD >= tier.min,
      );
      if (matchedTier) creditedAmountUSD *= 1 + matchedTier.bonus;
    }
    const finalAmountUSD = Math.round(amountUSD * 100) / 100;
    const finalCreditedUSD = Math.round(creditedAmountUSD * 100) / 100;

    await this.dataSource.transaction(async (manager) => {
      const currentDeposit = await manager.findOne(Deposit, {
        where: { id: deposit.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (currentDeposit?.status === DepositStatus.PENDING_CONFIRMATION) {
        await manager.findOne(User, {
          where: { id: deposit.userId },
          lock: { mode: 'pessimistic_write' },
        });

        await manager.update(Deposit, deposit.id, {
          status: DepositStatus.APPROVED,
          confirmations,
          amountUSD: finalAmountUSD,
          creditedAmountUSD: finalCreditedUSD,
        });
        await manager.increment(
          User,
          { id: deposit.userId },
          'walletBalance',
          finalCreditedUSD,
        );
        await manager.increment(
          User,
          { id: deposit.userId },
          'totalDeposited',
          finalAmountUSD,
        );

        const updatedUser = await manager.findOne(User, {
          where: { id: deposit.userId },
        });
        if (updatedUser) {
          this.eventsGateway.sendBalanceUpdate(deposit.userId, {
            walletBalance: updatedUser.walletBalance,
            totalDeposited: updatedUser.totalDeposited,
          });
        }

        this.logger.log({
          message: `Deposit ${deposit.id} approved.`,
          depositId: deposit.id,
          userId: deposit.userId,
          creditedUSD: finalCreditedUSD,
          originalUSD: finalAmountUSD,
          transactionHash: deposit.transactionHash,
        });
      }
    });
  }
}
