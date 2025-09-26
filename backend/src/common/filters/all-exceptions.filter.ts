import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from './business.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Nếu là BusinessException => trả về cho client, không log ra backend
    if (exception instanceof BusinessException) {
      return response.status(400).json({
        success: false,
        message: exception.message,
      });
    }

    // Nếu là HttpException khác
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(res);
    }

    // Các lỗi khác (system error) vẫn log ra để debug
    console.error('❌ System error:', exception);
    return response.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
