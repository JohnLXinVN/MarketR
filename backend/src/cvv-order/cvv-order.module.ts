import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersCVVService } from './cvv-order.service';
import { OrderCVVController } from './cvv-order.controller';
import { CVV } from 'src/cvv/cvv.entity';
import { User } from 'src/user/user.entity';
import { OrderCVV } from './cvv-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCVV, CVV, User])],
  controllers: [OrderCVVController],
  providers: [OrdersCVVService],
})
export class CvvOrderModule {}
