import { Injectable } from '@nestjs/common';
import { LoggerService } from 'libs/logger/src/logger.service';
import { BasePipeline } from 'src/common/pipeline/base-pipeline';
import { PipelineContext } from 'src/common/pipeline/types/pipeline-context.interface';
import { CoinSignalPipelineSharedData } from './types/coin-signal-pipeline-shared-data.interface';
import { FetchSocialPostsStep } from './steps/fetch-social-posts.step';
import { GenerateTradingSignalStep } from './steps/generate-trading-signal.step';
import { ProcessTradingSignalStep } from './steps/process-trading-signal.step';
import { PipelineOutput } from 'src/common/pipeline/types/pipeline-output.interface';

@Injectable()
export class CoinSignalPipeline extends BasePipeline<
  PipelineContext<CoinSignalPipelineSharedData>
> {
  constructor(
    logger: LoggerService,
    fetchSocialPostsStep: FetchSocialPostsStep,
    generateTradingSignalStep: GenerateTradingSignalStep,
    processTradingSignalStep: ProcessTradingSignalStep,
  ) {
    super(logger);

    this.addSteps([
      fetchSocialPostsStep,
      generateTradingSignalStep,
      processTradingSignalStep,
    ]);
  }

  async execute(
    sharedData: CoinSignalPipelineSharedData,
  ): Promise<PipelineOutput> {
    const context: PipelineContext<CoinSignalPipelineSharedData> = {
      id: `coin-signal-pipeline-${sharedData.coinId}-${Date.now()}`,
      sharedData,
    };

    return this._execute(context);
  }
}
