import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { LoggerService } from 'libs/logger/src/logger.service';
import { CoinSignalPipelineSharedData } from './pipeline/types/coin-signal-pipeline-shared-data.interface';
import { HoldingInfo } from './pipeline/types/holding-info.interface';

@Injectable()
export class CoinSignalService {
  constructor(
    private readonly logger: LoggerService,
    @InjectQueue('coin-signal') private coinSignalQueue: Queue,
  ) {}

  /**
   * Enqueues a coin signal pipeline job to generate and process trading signal for a given coin
   * @param coinId - The unique identifier of the coin
   * @param coinName - The name of the coin
   * @param holdings - Array of holdings to process in the signal pipeline
   */
  async enqueueCoinSignal(
    coinId: number,
    coinName: string,
    holdings: HoldingInfo[],
  ) {
    const sharedData: CoinSignalPipelineSharedData = {
      coinId,
      coinName,
      holdings,
    };

    const job = await this.coinSignalQueue.add(
      `coin-signal-${coinId}-${Date.now()}`,
      sharedData,
    );

    this.logger.info(
      `Enqueued coin signal pipeline ${job.id} for ${sharedData.coinName}`,
    );
  }
}
