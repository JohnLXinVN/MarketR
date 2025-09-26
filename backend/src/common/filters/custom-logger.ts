import { ConsoleLogger, Logger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // Nếu là BusinessException thì không log ra backend
    if (typeof message === 'string' && message.includes('BusinessException')) {
      return;
    }

    // Nếu không phải BusinessException thì log như bình thường
    super.error(message, stack, context);
  }
}
