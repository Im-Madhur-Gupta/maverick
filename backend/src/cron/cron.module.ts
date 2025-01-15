import { Module } from '@nestjs/common';
import { CoinSignalModule } from 'src/coin-signal/coin-signal.module';
import { FereModule } from 'src/fere/fere.module';
import { CronService } from './cron.service';

@Module({
  imports: [FereModule, CoinSignalModule],
  providers: [CronService],
})
export class CronModule {}
