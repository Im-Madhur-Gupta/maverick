import { Injectable } from '@nestjs/common';
import * as pLimit from 'p-limit';
import { PipelineStep } from 'src/common/pipeline/types/pipeline-step.interface';
import { PipelineContext } from 'src/common/pipeline/types/pipeline-context.interface';
import { FereService } from 'src/fere/fere.service';
import { CoinSignalPipelineSharedData } from '../types/coin-signal-pipeline-shared-data.interface';
import { TradingSignal } from 'src/ai/types/trading-signal.schema';
import {
  TradingSignalStrength,
  TradingSignalType,
} from 'src/ai/enums/trading-signal.enum';
import { solToLamports } from 'src/common/utils/asset.utils';
import {
  FERE_API_CONCURRENT_LIMIT,
  FERE_API_COOLDOWN_MS,
} from 'src/fere/constants';
import { sleep } from 'src/common/utils/time.utils';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Injectable()
export class ProcessTradingSignalStep
  implements
    PipelineStep<
      PipelineContext<CoinSignalPipelineSharedData>,
      TradingSignal,
      void
    >
{
  readonly name = 'Process Trading Signal for Coin';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly fereService: FereService,
  ) {}

  private validateExecuteParams(
    context: PipelineContext<CoinSignalPipelineSharedData>,
    input: TradingSignal,
  ): void {
    if (!context.sharedData) {
      throw new Error('Pipeline shared data is required');
    }
    if (!input.type || !input.strength || !input.percentage) {
      throw new Error(
        `Invalid trading signal. TradingSignal: ${JSON.stringify(input)}`,
      );
    }
  }

  private shouldProcessSignal(
    signalType: TradingSignalType,
    signalStrength: TradingSignalStrength,
  ): boolean {
    return (
      signalType !== TradingSignalType.HOLD &&
      signalStrength === TradingSignalStrength.STRONG
    );
  }

  async execute(
    context: PipelineContext<CoinSignalPipelineSharedData>,
    input: TradingSignal,
  ): Promise<void> {
    this.validateExecuteParams(context, input);

    const { holdings } = context.sharedData;
    const {
      type: signalType,
      strength: signalStrength,
      percentage: signalPercentage,
    } = input;

    if (!this.shouldProcessSignal(signalType, signalStrength)) {
      return;
    }

    // TODO: Implement proper error handling for parallel requests
    // Current implementation issues:
    // 1. BullMQ will retry ALL requests even if only some fail
    // 2. This can cause duplicate orders for already successful requests
    // 3. Need to implement:
    //    - Track successful/failed requests using Promise.allSettled()
    //    - Store successful requests state
    //    - Only retry failed requests
    const limit = pLimit(FERE_API_CONCURRENT_LIMIT);

    // Process holdings in batches with cooldown
    const batchSize = FERE_API_CONCURRENT_LIMIT;
    for (let i = 0; i < holdings.length; i += batchSize) {
      const batch = holdings.slice(i, i + batchSize);

      await Promise.all(
        batch.map((holding) =>
          limit(async () => {
            const { agentExternalId, holdingExternalId, amountBought } =
              holding;
            const quantityInLamports = solToLamports(
              (amountBought * signalPercentage) / 100,
            );

            if (signalType === TradingSignalType.SELL) {
              await this.fereService.createSellInstruction(
                agentExternalId,
                holdingExternalId,
                quantityInLamports,
              );
            }

            // TODO: Implement creating BUY instructions
            if (signalType === TradingSignalType.BUY) {
            }
          }),
        ),
      );

      // Sleep for 30 sec if there are more batches to process in order to avoid hitting API rate limit
      if (i + batchSize < holdings.length) {
        await sleep(FERE_API_COOLDOWN_MS);
      }
    }

    // TODO: Implement storing processed signals
  }
}
