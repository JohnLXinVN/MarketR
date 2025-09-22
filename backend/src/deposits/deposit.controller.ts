import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { DepositsService } from './deposit.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post('/request-address')
  async requestDepositAddress(
    @Body(new ValidationPipe()) createDepositDto: CreateDepositDto,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    return this.depositsService.findAndLockAddress(
      userId,
      createDepositDto.currency,
    );
  }

  @Get('/pool-status')
  async getPoolStatus() {
    return this.depositsService.getPoolStatus();
  }

  @Get('/history')
  async getDepositHistory(@Req() req) {
    const userId = Number(req.user.userId);
    return this.depositsService.getUserDeposits(userId);
  }
}
