import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { FereModule } from 'src/fere/fere.module';

@Module({
  imports: [FereModule],
  providers: [CronService],
})
export class CronModule {}
