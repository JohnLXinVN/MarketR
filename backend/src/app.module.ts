import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CvvModule } from './cvv/cvv.module';
import { CartModule } from './cart/cart.module';
import { CartItem } from './cart/cart-item.entity';
import { CvvOrderModule } from './cvv-order/cvv-order.module';
import { DepositsModule } from './deposits/deposit.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        BLOCKCYPHER_API_TOKEN: Joi.string().required(),
        TRONGRID_API_KEY: Joi.string().required(),
        // Thêm các biến môi trường khác cần xác thực ở đây
      }),
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USER as string,
      password: process.env.DB_PASS as string,
      database: process.env.DB_NAME as string,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule,
    AuthModule,
    CvvModule,
    CartModule,
    CvvOrderModule,
    DepositsModule,
  ],
})
export class AppModule {}
