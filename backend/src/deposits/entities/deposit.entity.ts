import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';

// Enum cho trạng thái, định nghĩa ngay tại đây
export enum DepositStatus {
  NEW = 'NEW',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  APPROVED = 'APPROVED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

@Entity('deposits') // Tên bảng trong database
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DepositStatus,
    default: DepositStatus.NEW,
  })
  status: DepositStatus;

  @ManyToOne(() => User, (user) => user.deposits)
  @JoinColumn({ name: 'userId' }) // map cột
  user: User;

  @Column()
  userId: number;

  @Column()
  currency: string; // "ltc", "btc", "usdt"

  @Column({ type: 'float', nullable: true })
  amountCrypto: number;

  @Column({ type: 'float', nullable: true })
  amountUSD: number;

  @Column({ type: 'float', nullable: true })
  creditedAmountUSD: number;

  @Column()
  depositAddress: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: true })
  transactionHash: string;

  @Column({ default: 0 })
  confirmations: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
