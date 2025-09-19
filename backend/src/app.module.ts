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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
})
export class AppModule {}
