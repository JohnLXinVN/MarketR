import {
  Controller,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CvvService } from './cvv.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cvvs')
export class CvvController {
  constructor(private readonly cvvService: CvvService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get_all_data_search')
  async getDataSearch() {
    try {
      return {
        getCardTypes: await this.cvvService.getCardTypes(),
        getCardClass: await this.cvvService.getCardClass(),
        getCardLevel: await this.cvvService.getCardLevel(),
      };
    } catch (error) {
      console.error(error); // log lỗi ra console
      throw new BadRequestException('error get_all_data_search');
    }
  }
}
