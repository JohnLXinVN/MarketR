import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string) {
    super({ success: false, message }, HttpStatus.BAD_REQUEST);
  }
}
