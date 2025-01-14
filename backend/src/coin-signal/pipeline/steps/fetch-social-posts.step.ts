import { Injectable } from '@nestjs/common';
import { PipelineStep } from 'src/common/pipeline/types/pipeline-step.interface';
import { PipelineContext } from 'src/common/pipeline/types/pipeline-context.interface';
import { SocialService } from 'src/social/social.service';
import { CoinSignalPipelineSharedData } from '../types/coin-signal-pipeline-shared-data.interface';
import { SocialPost } from 'src/social/types/social-post.interface';

@Injectable()
export class FetchSocialPostsStep
  implements
    PipelineStep<
      PipelineContext<CoinSignalPipelineSharedData>,
      void,
      SocialPost[]
    >
{
  readonly name = 'Fetch Social Posts for Coin';

  constructor(private readonly socialService: SocialService) {}

  private validateExecuteParams(
    context: PipelineContext<CoinSignalPipelineSharedData>,
  ): void {
    if (!context.sharedData) {
      throw new Error('Pipeline shared data is required');
    }
  }

  async execute(
    context: PipelineContext<CoinSignalPipelineSharedData>,
  ): Promise<SocialPost[]> {
    this.validateExecuteParams(context);

    const { coinName } = context.sharedData;
    const { posts } = await this.socialService.getPostsForCoin(coinName);

    return posts;
  }
}
