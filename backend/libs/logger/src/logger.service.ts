import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pino } from 'pino';

@Injectable()
export class LoggerService {
  readonly logger: pino.Logger;

  constructor(config: ConfigService) {
    this.logger = pino({
      level: config.get('LOG_LEVEL') || 'info',
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
