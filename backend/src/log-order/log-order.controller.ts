import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LogsOrderService } from './log-order.service';
import { QueryLogOrdersDto } from './dto/query-log-orders.dto';
import { createReadStream } from 'fs';
import path from 'path';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsOrderController {
  constructor(private readonly logsOrderService: LogsOrderService) {}

  // ENDPOINT MỚI: Để mua log
  @Post(':id/buy')
  buyLog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req, // req.user sẽ có sau khi qua Guard
  ) {
    const userId = req.user.userId;
    return this.logsOrderService.buyLog(id, userId);
  }

  @Post('listLogsByUser')
  findUserOrders(
    @Req() req,
    @Body(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
    queryDto: QueryLogOrdersDto,
  ) {
    const userId = req.user.userId;
    return this.logsOrderService.findForUser(userId, queryDto);
  }

  @Get(':id/download')
  async downloadLog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const userId = req.user.userId;
    // Lấy chi tiết file từ service

    console.log('Download log id', id, 'for userId', userId);
    const { filePath, fileName, fileSizeInBytes } =
      await this.logsOrderService.getDownloadPath(id, userId);

    const fileStream = createReadStream(filePath);

    // **ĐIỀU KHIỂN METADATA TẠI ĐÂY**
    res.set({
      'Content-Type': 'application/zip',
      // Header này quyết định TÊN file khi người dùng tải về
      'Content-Disposition': `attachment; filename="${fileName}"`,
      // Header này quyết định DUNG LƯỢNG file mà trình duyệt hiển thị
      'Content-Length': fileSizeInBytes,
    });

    // Gửi nội dung của file template đi
    return new StreamableFile(fileStream);
  }
}
