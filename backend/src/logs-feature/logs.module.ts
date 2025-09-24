import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'; // Sửa lại đường dẫn
import { EventsGateway } from 'src/events/events.gateway';
import { Log } from './log.entity';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log, User])],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
