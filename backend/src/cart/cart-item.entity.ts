import { CVV } from 'src/cvv/cvv.entity';
import { User } from 'src/user/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('cart_items')
@Unique(['user', 'cvv']) // đảm bảo 1 user chỉ có 1 cartItem cho mỗi cvv
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // sẽ tạo cột userId
  user: User;

  @ManyToOne(() => CVV, (cvv) => cvv.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cvvId' }) // sẽ tạo cột cvvId
  cvv: CVV;

  @CreateDateColumn()
  createdAt: Date;
}
