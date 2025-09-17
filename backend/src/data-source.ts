// src/data-source.ts
import { DataSource } from 'typeorm';
import { CVV } from './cvv/cvv.entity';
import { configDotenv } from 'dotenv';

configDotenv();
export const AppDataSource = new DataSource({
  type: 'mysql', // hoặc mysql/mariadb tùy bạn
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  entities: [CVV],
  synchronize: true, // chỉ bật khi dev
  logging: false,
});
