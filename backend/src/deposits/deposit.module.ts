import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainService } from './blockchain.service';
import { Deposit } from './entities/deposit.entity';
import { User } from '../user/user.entity'; // Sửa lại đường dẫn
import { PaymentAddress } from './entities/payment-address.entity';
import { DepositsController } from './deposit.controller';
import { DepositsService } from './deposit.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit, User, PaymentAddress])],
  controllers: [DepositsController],
  providers: [DepositsService, BlockchainService, EventsGateway],
})
export class DepositsModule {}
