import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CVV } from 'src/cvv/cvv.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(CVV)
    private readonly cvvRepository: Repository<CVV>,
  ) {}

  // Lấy giỏ hàng của user
  async findByUserId(userId: number): Promise<string[]> {
    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['cvv'],
    });
    // Chỉ trả về mảng các ID của CVV
    return cartItems.map((item) => item.cvv.id);
  }

  // Thêm 1 sản phẩm vào giỏ
  async add(cvvId: string, userId: number): Promise<CartItem> {
    const cvv = await this.cvvRepository.findOneBy({
      id: cvvId,
      isAvailable: true,
    });
    if (!cvv) {
      throw new NotFoundException(
        `CVV with ID ${cvvId} not found or not available.`,
      );
    }

    const existingItem = await this.cartItemRepository.findOneBy({
      user: { id: userId },
      cvv: { id: cvvId },
    });

    if (existingItem) {
      throw new ConflictException('This item is already in your cart.');
    }

    const newItem = this.cartItemRepository.create({
      user: { id: userId },
      cvv: { id: cvvId },
    });

    return this.cartItemRepository.save(newItem);
  }

  // Thêm nhiều sản phẩm vào giỏ
  async addBulk(
    cvvIds: string[],
    userId: number,
  ): Promise<{ addedCount: number }> {
    // 1. Lấy danh sách các CVV hợp lệ và có sẵn
    const validCvvs = await this.cvvRepository.findBy({
      id: In(cvvIds),
      isAvailable: true,
    });
    const validCvvIds = validCvvs.map((cvv) => cvv.id);

    if (validCvvIds.length === 0) {
      return { addedCount: 0 };
    }

    // 2. Tìm các sản phẩm đã có trong giỏ hàng của user
    const existingItems = await this.cartItemRepository.find({
      where: {
        user: { id: userId },
        cvv: { id: In(validCvvIds) },
      },
      relations: ['cvv'],
    });
    const existingCvvIds = new Set(existingItems.map((item) => item.cvv.id));

    // 3. Lọc ra những ID mới thực sự cần thêm vào
    const newItemsToAdd = validCvvIds
      .filter((id) => !existingCvvIds.has(id))
      .map((id) =>
        this.cartItemRepository.create({
          user: { id: userId },
          cvv: { id },
        }),
      );

    if (newItemsToAdd.length > 0) {
      await this.cartItemRepository.save(newItemsToAdd);
    }

    return { addedCount: newItemsToAdd.length };
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['cvv'], // Quan trọng: Lấy cả thông tin chi tiết của CVV
    });
  }
  async removeItemFromCart(userId: number, cartItemId: string): Promise<void> {
    const result = await this.cartItemRepository.delete({
      id: cartItemId,
      user: { id: userId }, // Đảm bảo người dùng chỉ có thể xóa item của chính họ
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }
  }

  // Xóa nhiều sản phẩm đã chọn
  async removeSelectedItems(
    userId: number,
    cartItemIds: string[],
  ): Promise<void> {
    if (!cartItemIds || cartItemIds.length === 0) {
      return;
    }

    await this.cartItemRepository.delete({
      id: In(cartItemIds),
      user: { id: userId }, // Bảo mật: Chỉ xóa các item thuộc về user này
    });
  }
}
