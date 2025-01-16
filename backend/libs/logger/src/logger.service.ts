import { Injectable } from '@nestjs/common';
import { pino } from 'pino';

@Injectable()
export class LoggerService {
  readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: 'info',
    });
  }

  error(message: string, context?: object): void {
    this.logger.error(context, message);
  }

  warn(message: string, context?: object): void {
    this.logger.warn(context, message);
  }

  info(message: string, context?: object): void {
    this.logger.info(context, message);
  }

  debug(message: string, context?: object): void {
    this.logger.debug(context, message);
  }
}
