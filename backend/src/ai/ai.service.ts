import { Inject, Injectable } from '@nestjs/common';
import { LLM_PROVIDER } from './constants';
import { LlmProvider } from './types/llm-provider.interface';
import {
  TradingSignal,
  TradingSignalSchema,
} from './types/trading-signal.schema';
import { SocialPost } from 'src/social/types/social-post.interface';
import { LoggerService } from 'libs/logger/src/logger.service';

@Injectable()
export class AIService {
  constructor(
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LlmProvider,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Generate a trading signal for a given coin
   * @param coinName - The name of the coin
   * @param socialPosts - The social posts for the coin
   * @returns The trading signal
   */
  async generateTradingSignal(
    coinName: string,
    socialPosts: SocialPost[],
  ): Promise<TradingSignal> {
    try {
      const prompt = `
    Analyze the following Farcaster social data for ${coinName} and generate a trading signal.
    
    Social Data:
    ${JSON.stringify(socialPosts, null, 2)}
    
    Generate a trading signal based on the sentiment, engagement, and overall social activity.
    Consider factors like:
    - Post volume and engagement trends
    - Sentiment of discussions
    - Notable influencer activity
    - Unusual patterns or anomalies
    
    Provide a structured response with your analysis and trading recommendation.
    `;

      return await this.llmProvider.getStructuredResponse<TradingSignal>(
        prompt,
        TradingSignalSchema,
      );
    } catch (error) {
      this.logger.error(
        `Error generating trading signal for ${coinName}: ${error}`,
      );
      throw error;
    }
  }
}
