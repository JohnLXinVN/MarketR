import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'; // Sửa lại đường dẫn
import { EventsGateway } from 'src/events/events.gateway';
import { Log } from 'src/logs-feature/log.entity';
import { LogOrder } from './log-order.entity';
import { LogsOrderController } from './log-order.controller';
import { LogsOrderService } from './log-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log, User, LogOrder])],
  controllers: [LogsOrderController],
  providers: [LogsOrderService],
})
export class LogsOrderModule {}
