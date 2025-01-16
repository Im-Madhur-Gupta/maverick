import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { LoggerService } from 'libs/logger/src/logger.service';
import { CoinSignalPipelineSharedData } from './pipeline/types/coin-signal-pipeline-shared-data.interface';
import { HoldingInfo } from './pipeline/types/holding-info.interface';
import { GetProcessedSignalsResponse } from './types/get-processed-signals.interface';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Injectable()
export class CoinSignalService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
    @InjectQueue('coin-signal') private coinSignalQueue: Queue,
  ) {}

  /**
   * Enqueues a coin signal pipeline job to generate and process trading signal for a given coin
   * @param coinId - The unique identifier of the coin
   * @param coinName - The name of the coin
   * @param holdings - Array of holdings to process in the signal pipeline
   */
  async enqueue(coinId: number, coinName: string, holdings: HoldingInfo[]) {
    const sharedData: CoinSignalPipelineSharedData = {
      coinId,
      coinName,
      holdings,
    };

    const job = await this.coinSignalQueue.add(
      `coin-signal-${coinId}-${Date.now()}`,
      sharedData,
    );

    this.loggerService.info(
      `Enqueued coin signal pipeline ${job.id} for ${sharedData.coinName}`,
    );
  }

  async getProcessedSignals(
    agentId: string,
    userId: number,
  ): Promise<GetProcessedSignalsResponse> {
    try {
      const agent = await this.prismaService.agent.findUnique({
        where: { id: agentId },
        include: {
          processedCoinSignals: {
            include: {
              coin: true,
            },
            orderBy: {
              sentAt: 'desc',
            },
          },
        },
      });

      if (!agent) {
        throw new NotFoundException('Agent not found');
      }

      if (agent.ownerId !== userId) {
        throw new ForbiddenException('Agent does not belong to user');
      }

      return {
        signals: agent.processedCoinSignals,
      };
    } catch (error) {
      this.loggerService.error(`Error getting processed signals: ${error}`);
      throw new InternalServerErrorException('Error getting processed signals');
    }
  }
}
