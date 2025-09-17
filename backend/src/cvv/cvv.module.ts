import { Module } from '@nestjs/common';
import { CvvController } from './cvv.controller';
import { CvvService } from './cvv.service';
import { CVV } from './cvv.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CVV]), AuthModule],
  controllers: [CvvController],
  providers: [CvvService],
})
export class CvvModule {}
