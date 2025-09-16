import { Module } from '@nestjs/common';
import { CvvController } from './cvv.controller';
import { CvvService } from './cvv.service';

@Module({
  controllers: [CvvController],
  providers: [CvvService]
})
export class CvvModule {}
