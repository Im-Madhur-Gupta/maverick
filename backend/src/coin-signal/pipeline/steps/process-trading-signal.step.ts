import { Injectable } from '@nestjs/common';
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

  constructor(private readonly fereService: FereService) {}

  private validateExecuteParams(
    context: PipelineContext<CoinSignalPipelineSharedData>,
    input: TradingSignal,
  ): void {
    if (!context.sharedData) {
      throw new Error('Pipeline shared data is required');
    }
    if (!input.type || !input.strength || !input.percentage) {
      throw new Error('Invalid trading signal');
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

    for (const holding of holdings) {
      if (signalType === TradingSignalType.SELL) {
        const { agentExternalId, holdingExternalId, amountBought } = holding;

        const quantityInLamports = solToLamports(
          signalPercentage * amountBought,
        );

        await this.fereService.createSellInstruction(
          agentExternalId,
          holdingExternalId,
          quantityInLamports,
        );
      }

      // TODO: Implement creating BUY instructions
      if (signalType === TradingSignalType.BUY) {
        break;
      }
    }
  }
}
