import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { QueryLogsDto } from './dto/query-logs.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK) // Mặc định POST trả về 201, ta muốn 200
  search(
    @Body(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
    queryDto: QueryLogsDto,
  ) {
    console.log('Search Logs with DTO:', queryDto);
    return this.logsService.search(queryDto);
  }

  @Get('filterOptions')
  getDistinctStealers() {
    return this.logsService.getFilterOptions();
  }
}
