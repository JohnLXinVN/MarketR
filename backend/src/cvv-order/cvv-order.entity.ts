import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { CVV } from '../cvv/cvv.entity';

@Entity('order_cvvs')
export class OrderCVV {
  @PrimaryGeneratedColumn()
  id: number;

  // The user who made the purchase
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  // The CVV that was purchased. Using OneToOne assumes a CVV can only be sold once.
  @OneToOne(() => CVV)
  @JoinColumn()
  cvv: CVV;

  @CreateDateColumn()
  createdAt: Date;
}
