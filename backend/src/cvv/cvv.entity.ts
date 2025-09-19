// src/products/entities/product.entity.ts
import { CartItem } from 'src/cart/cart-item.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('cvvs')
export class CVV {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 16 })
  binNumber: string;

  @Column({ length: 50, nullable: true })
  issuingBank: string;

  @Column()
  cardHolder: string;

  @Column()
  CVV: number;

  @Column({ length: 20 })
  cardType: string; // VISA, MASTERCARD

  @Column({ length: 20 })
  cardClass: string; // DEBIT, CREDIT

  @Column({ length: 20 })
  cardLevel: string; // PLATINUM, GOLD

  @Column({ length: 5, comment: 'MM/YY' })
  expiryDate: string;

  @Index()
  @Column({ length: 2 })
  country: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 20, nullable: true })
  zip: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  dataSource: string;

  @Column({ nullable: true })
  sellerName: string;

  @Column({ nullable: true })
  specificAddress: string;

  @Column({ default: false })
  hasSsn: boolean;

  @Column({ default: false })
  hasDob: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cvv)
  cartItems: CartItem[];
}
