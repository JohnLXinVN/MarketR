import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaymentAddress,
  AddressStatus,
} from './entities/payment-address.entity';
import { Deposit } from './entities/deposit.entity';

const ADDRESS_LOCK_DURATION_MS = 10 * 60 * 1000; // 10 phút

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(PaymentAddress)
    private paymentAddressRepository: Repository<PaymentAddress>,
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
  ) {}

  async findAndLockAddress(userId: number, currency: string) {
    const existingLock = await this.paymentAddressRepository.findOne({
      where: {
        lockedByUserId: userId,
        currency: currency,
        status: AddressStatus.LOCKED,
      },
    });

    if (existingLock && existingLock.lockExpiresAt) {
      // Nếu user đã có một địa chỉ đang khóa, trả về thông tin địa chỉ đó
      // thay vì tạo một khóa mới.
      return {
        address: existingLock.address,
        currency: existingLock.currency,
        expiresAt: existingLock?.lockExpiresAt?.toISOString(),
        message: 'You already have an active deposit address.',
      };
    }

    return this.paymentAddressRepository.manager.transaction(
      async (manager) => {
        const availableAddress = await manager.findOne(PaymentAddress, {
          where: { currency, status: AddressStatus.AVAILABLE },
          lock: { mode: 'pessimistic_write' },
        });

        if (!availableAddress) {
          throw new HttpException(
            'All payment addresses are currently busy. Please try again later.',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        availableAddress.status = AddressStatus.LOCKED;
        availableAddress.lockedByUserId = userId;
        availableAddress.lockExpiresAt = new Date(
          Date.now() + ADDRESS_LOCK_DURATION_MS,
        );
        await manager.save(availableAddress);

        return {
          address: availableAddress.address,
          currency: availableAddress.currency,
          expiresAt: availableAddress.lockExpiresAt.toISOString(),
        };
      },
    );
  }

  async getPoolStatus() {
    const counts = await this.paymentAddressRepository
      .createQueryBuilder('pa')
      .select('pa.currency', 'currency')
      .addSelect('COUNT(pa.id)', 'availableCount')
      .where('pa.status = :status', { status: AddressStatus.AVAILABLE })
      .groupBy('pa.currency')
      .getRawMany();

    const status = { btc: 0, ltc: 0, usdt: 0 };
    counts.forEach((count) => {
      if (status.hasOwnProperty(count.currency)) {
        status[count.currency] = parseInt(count.availableCount, 10);
      }
    });
    return status;
  }

  async getUserDeposits(userId: number): Promise<Deposit[]> {
    return this.depositRepository.find({
      where: { id: userId },
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }
}
