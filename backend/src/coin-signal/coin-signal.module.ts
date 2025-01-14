import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from 'libs/redis/src/redis.module';
import { SocialModule } from 'src/social/social.module';
import { AIModule } from 'src/ai/ai.module';
import { FereModule } from 'src/fere/fere.module';
import { CoinSignalService } from './coin-signal.service';
import { CoinSignalProcessor } from './coin-signal.processor';
import { CoinSignalPipeline } from './pipeline/coin-signal.pipeline';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'coin-signal',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }),
    RedisModule,
    SocialModule,
    AIModule,
    FereModule,
  ],
  providers: [CoinSignalService, CoinSignalProcessor, CoinSignalPipeline],
  exports: [CoinSignalService],
})
export class CoinSignalModule {}
