// src/ticket/ticket.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  reason: string;

  @Column({ length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255 })
  paymentAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
