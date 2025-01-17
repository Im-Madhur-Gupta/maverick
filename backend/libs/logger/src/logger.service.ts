import { Injectable } from '@nestjs/common';
import { pino } from 'pino';

@Injectable()
export class LoggerService {
  readonly loggerService: pino.Logger;

  constructor() {
    this.loggerService = pino({
      level: 'info',
    });
  }

  error(message: string, context?: object): void {
    this.loggerService.error(context, message);
  }

  warn(message: string, context?: object): void {
    this.loggerService.warn(context, message);
  }

  info(message: string, context?: object): void {
    this.loggerService.info(context, message);
  }

  debug(message: string, context?: object): void {
    this.loggerService.debug(context, message);
  }
}
