import { Log } from 'src/logs-feature/log.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('log_orders')
export class LogOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  logId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePaid: number;

  @ManyToOne(() => User, (user) => user.logOrders)
  user: User;

  @ManyToOne(() => Log, (log) => log.orders)
  log: Log;

  @CreateDateColumn()
  createdAt: Date;
}
