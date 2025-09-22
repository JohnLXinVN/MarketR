import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum AddressStatus {
  AVAILABLE = 'available',
  LOCKED = 'locked',
}

@Entity('payment_addresses')
export class PaymentAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column()
  currency: string; // 'btc', 'ltc', 'usdt'

  @Index()
  @Column({
    type: 'enum',
    enum: AddressStatus,
    default: AddressStatus.AVAILABLE,
  })
  status: AddressStatus;

  @Column({ type: 'int', nullable: true })
  lockedByUserId: number | null;

  @Column({ type: 'timestamp', nullable: true })
  lockExpiresAt: Date | null;
}
