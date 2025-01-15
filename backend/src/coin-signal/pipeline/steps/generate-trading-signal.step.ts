import { Injectable } from '@nestjs/common';
import { PipelineStep } from 'src/common/pipeline/types/pipeline-step.interface';
import { PipelineContext } from 'src/common/pipeline/types/pipeline-context.interface';
import { AIService } from 'src/ai/ai.service';
import { CoinSignalPipelineSharedData } from '../types/coin-signal-pipeline-shared-data.interface';
import { SocialPost } from 'src/social/types/social-post.interface';
import { TradingSignal } from 'src/ai/types/trading-signal.schema';
import { LoggerService } from 'libs/logger/src/logger.service';

@Injectable()
export class GenerateTradingSignalStep
  implements
    PipelineStep<
      PipelineContext<CoinSignalPipelineSharedData>,
      SocialPost[],
      TradingSignal
    >
{
  readonly name = 'Generate Trading Signal for Coin from Social Posts';

  constructor(
    private readonly aiService: AIService,
    private readonly loggerService: LoggerService,
  ) {}

  private validateExecuteParams(
    context: PipelineContext<CoinSignalPipelineSharedData>,
    input: SocialPost[],
  ): void {
    if (!context.sharedData) {
      throw new Error('Pipeline shared data is required');
    }

    if (input.length === 0) {
      throw new Error('No social posts provided');
    }
  }

  async execute(
    context: PipelineContext<CoinSignalPipelineSharedData>,
    input: SocialPost[],
  ): Promise<TradingSignal> {
    this.validateExecuteParams(context, input);

    const { coinName } = context.sharedData;
    const tradingSignal = await this.aiService.generateTradingSignal(
      coinName,
      input,
    );

    this.loggerService.info(`Generated trading signal for ${coinName}`, {
      signal: {
        type: tradingSignal.type,
        strength: tradingSignal.strength,
        percentage: tradingSignal.percentage,
      },
      postsAnalyzed: input.length,
    });

    return tradingSignal;
  }
}
