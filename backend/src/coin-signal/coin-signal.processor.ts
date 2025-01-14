import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { LoggerService } from 'libs/logger/src/logger.service';
import { RedisService } from 'libs/redis/src/redis.service';
import { CoinSignalPipeline } from './pipeline/coin-signal.pipeline';
import { CoinSignalPipelineSharedData } from './pipeline/types/coin-signal-pipeline-shared-data.interface';

@Injectable()
@Processor('coin-signal')
export class CoinSignalProcessor extends WorkerHost {
  constructor(
    private readonly logger: LoggerService,
    private readonly redisService: RedisService,
    private readonly coinSignalPipeline: CoinSignalPipeline,
  ) {
    super();
  }

  async process(job: Job<CoinSignalPipelineSharedData>): Promise<void> {
    const { coinId, coinName } = job.data;

    this.logger.debug(`Starting coin signal pipeline for ${coinName}`, {
      jobId: job.id,
      attempt: job.attemptsMade + 1,
    });

    // Check if coin is already being processed
    const isLocked = await this.redisService.isCoinLocked(coinId);
    if (isLocked) {
      this.logger.info(
        `Skipping coin signal pipeline for ${coinName} as it's already being processed`,
        { jobId: job.id },
      );
      return;
    }

    // Lock the coin before processing
    const locked = await this.redisService.lockCoin(coinId);
    if (!locked) {
      this.logger.warn(
        `Failed to acquire lock for ${coinName}, another process may have taken it`,
        { jobId: job.id },
      );
      return;
    }

    try {
      const result = await this.coinSignalPipeline.execute(job.data);

      if (!result.success) {
        const error = new Error(`Coin signal pipeline failed for ${coinName}`);
        this.logger.error(error.message, {
          jobId: job.id,
          stepOutputs: result.stepOutputs,
        });
        throw error;
      }

      this.logger.info(`Coin signal pipeline completed for ${coinName}`, {
        jobId: job.id,
        stepOutputs: result.stepOutputs,
      });
    } catch (error) {
      this.logger.error(
        `Unexpected error in coin signal processor for ${coinName}`,
        {
          jobId: job.id,
          error: error.message,
          stack: error.stack,
        },
      );
      throw error;
    } finally {
      await this.redisService.unlockCoin(coinId);
    }
  }
}
