import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { OrdersCVVService } from './cvv-order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { AuthGuard } from '@nestjs/passport'; // Giả sử có xác thực

@UseGuards(JwtAuthGuard)
@Controller('orders-cvv')
export class OrderCVVController {
  constructor(private readonly orderCVVService: OrdersCVVService) {}

  @Get()
  async getUserOrders(@Query('page') page: number = 1, @Req() req) {
    const userId = req.user.userId;
    return this.orderCVVService.findOrdersCVVForUser(userId, page);
  }

  @Post()
  async createOrder(@Body() createOrderDto, @Req() req) {
    const userId = req.user.userId;
    return this.orderCVVService.createOrderCVV(userId, createOrderDto.cvvIds);
  }
}
