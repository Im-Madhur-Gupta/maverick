import { Injectable } from '@nestjs/common';
import { LoggerService } from 'libs/logger/src/logger.service';
import { FarcasterSocialProvider } from './providers/farcaster-social.provider';
import { GetPostsForCoinResponse } from './types/get-posts-for-coin.interface';

@Injectable()
export class SocialService {
  constructor(
    private readonly logger: LoggerService,
    private readonly farcasterSocialProvider: FarcasterSocialProvider,
  ) {}

  async getPostsForCoin(coinName: string): Promise<GetPostsForCoinResponse> {
    try {
      return await this.farcasterSocialProvider.getPostsForCoin(coinName);
    } catch (error) {
      this.logger.error(`Error fetching posts for ${coinName}:`, error);
      throw error;
    }
  }
}
