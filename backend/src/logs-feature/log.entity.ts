import { LogOrder } from 'src/log-order/log-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stealer: string;

  @Column()
  system_name: string;

  @Column()
  country: string; // Mã quốc gia, ví dụ: 'US', 'AF'

  @Column('simple-array') // Lưu trữ dưới dạng chuỗi 'a,b,c'
  links: string[];

  @Column()
  hasOutlook: boolean;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  isp: string;

  @Column('simple-array', { nullable: true })
  emails: string[];

  @Column()
  vendor: string;

  @Column()
  struct: string; // Tên file, ví dụ: 'archive.zip'

  @Column('int')
  size: number; // Kích thước file tính bằng KB

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => LogOrder, (order) => order.log)
  orders: LogOrder[];
}
