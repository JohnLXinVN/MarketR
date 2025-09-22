import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport'; // Giả sử bạn dùng JWT
import {
  CreateBulkCartItemsDto,
  CreateCartItemDto,
} from './dto/add-to-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.userId;
    return this.cartService.findByUserId(userId);
  }

  @Post()
  async addToCart(@Body() createCartItemDto: CreateCartItemDto, @Req() req) {
    const userId = req.user.userId;

    return this.cartService.add(createCartItemDto.cvvId, userId);
  }

  @Post('bulk')
  async addBulkToCart(
    @Body() createBulkCartItemsDto: CreateBulkCartItemsDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.cartService.addBulk(createBulkCartItemsDto.cvvIds, userId);
  }

  @Delete('item/:id')
  async removeItem(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    await this.cartService.removeItemFromCart(userId, id);
    return { message: 'Item removed successfully' };
  }

  @Get('cart-items')
  async getCartItem(@Req() req) {
    const userId = req.user.userId;
    return this.cartService.getCartItems(userId);
  }

  // API để xóa các item đã chọn
  @Delete('selected')
  async removeSelectedItems(@Body() body, @Req() req) {
    const userId = req.user.userId;
    await this.cartService.removeSelectedItems(userId, body.cartItemIds);
    return { message: 'Selected items removed successfully' };
  }
}
