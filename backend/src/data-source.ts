// src/data-source.ts
import { DataSource } from 'typeorm';
import { CVV } from './cvv/cvv.entity';
import { configDotenv } from 'dotenv';
import { CartItem } from './cart/cart-item.entity';
import { User } from './user/user.entity';
import { Deposit } from './deposits/entities/deposit.entity';
import { Log } from './logs-feature/log.entity';
import { LogOrder } from './log-order/log-order.entity';

configDotenv();
export const AppDataSource = new DataSource({
  type: 'mysql', // hoặc mysql/mariadb tùy bạn
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  entities: [CVV, Log, CartItem, User, Deposit, LogOrder],
  synchronize: true, // chỉ bật khi dev
  logging: false,
});
