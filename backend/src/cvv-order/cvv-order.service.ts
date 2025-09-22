import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { OrderCVV } from './cvv-order.entity';
import { CVV } from 'src/cvv/cvv.entity';
import { User } from 'src/user/user.entity';
import { CartItem } from 'src/cart/cart-item.entity';

// Define a type for our paginated response
export interface PaginatedOrdersResult {
  data: any[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

@Injectable()
export class OrdersCVVService {
  constructor(
    @InjectRepository(OrderCVV)
    private readonly orderCVVRepository: Repository<OrderCVV>,
    @InjectRepository(CVV)
    private readonly cvvRepository: Repository<CVV>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findOrdersCVVForUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedOrdersResult> {
    const [ordersCVV, totalItems] = await this.orderCVVRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['cvv'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = ordersCVV.map((order) => {
      const fullAddress = [
        order.cvv.specificAddress,
        order.cvv.city,
        order.cvv.state,
        order.cvv.country,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        id: order.id,

        formattedCvv: `${order.cvv.binNumber} | ${order.cvv.expiryDate} | ${order.cvv.CVV} | ${order.cvv.cardHolder} | ${fullAddress}`,
        expiryDate: order.cvv.expiryDate,
        status: 'no refund',
      };
    });

    return {
      data: formattedData,
      meta: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
      },
    };
  }

  async createOrderCVV(userId: number, cvvIds: string[]) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      try {
        const userRepository = transactionalEntityManager.getRepository(User);
        const cvvRepository = transactionalEntityManager.getRepository(CVV);
        const orderCVVRepository =
          transactionalEntityManager.getRepository(OrderCVV);
        const cartItemRepository =
          transactionalEntityManager.getRepository(CartItem); // Lấy repository trong transaction

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        const cleanedCvvIds = cvvIds.map((id) => String(id).trim());

        const cvvsToPurchase = await cvvRepository.find({
          where: { id: In(cleanedCvvIds) },
          lock: { mode: 'pessimistic_write' },
        });


        if (cvvsToPurchase.some((cvv) => !cvv.isAvailable)) {
          throw new BadRequestException(
            'Sorry, one of the CVVs was just purchased by someone else.',
          );
        }

        if (cvvsToPurchase.length !== cleanedCvvIds.length) {
          throw new BadRequestException(
            'Some CVVs do not exist or are not available.',
          );
        }

        const totalAmount = cvvsToPurchase.reduce(
          (sum, cvv) => sum + Number(cvv.price),
          0,
        );

        if (Number(user.walletBalance) < totalAmount) {
          throw new BadRequestException('Insufficient wallet balance.');
        }

        user.walletBalance = Number(user.walletBalance) - totalAmount;
        await userRepository.save(user);

        const orderItems = cvvsToPurchase.map((cvv) => {
          return orderCVVRepository.create({
            cvv,
            user,
          });
        });

        const purchasedIds = cvvsToPurchase.map((cvv) => cvv.id);
        await cvvRepository.update(
          { id: In(purchasedIds) },
          { isAvailable: false },
        );

        await cartItemRepository.delete({
          user: { id: userId },
          cvv: { id: In(cvvIds) },
        });

        await orderCVVRepository.save(orderItems);

        return {
          success: true,
          message: 'Order created successfully!',
          newBalance: user.walletBalance,
        };
      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    });
  }
}
