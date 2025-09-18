import {
  Controller,
  Get,
  UseGuards,
  BadRequestException,
  Body,
  Post,
} from '@nestjs/common';
import { CvvService } from './cvv.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('cvvs')
export class CvvController {
  constructor(private readonly cvvService: CvvService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get_all_data_search')
  async getDataSearch() {
    try {
      console.error('ok'); // log lỗi ra console

      return {
        getCardTypes: await this.cvvService.getCardTypes(),
        getCardClass: await this.cvvService.getCardClass(),
        getCardLevel: await this.cvvService.getCardLevel(),
        getMinPrice: (await this.cvvService.getMinMaxPrice()).min,
        getMaxPrice: (await this.cvvService.getMinMaxPrice()).max,
      };
    } catch (error) {
      console.error(error); // log lỗi ra console
      throw new BadRequestException('error get_all_data_search');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get_list_cvv')
  async getListCVV(@Body() body: any) {
    try {
      return await this.cvvService.findAll(body);
    } catch (error) {
      console.error(error); // log lỗi ra console
      throw new BadRequestException('error get_list_cvv');
    }
  }
}
