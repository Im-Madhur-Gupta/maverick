import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from 'libs/logger/src/logger.service';
import { SOCIAL_PLATFORM } from '../enums/social-platform.enum';
import { SocialProvider } from '../types/social-provider.interface';
import { GetPostsForCoinResponse } from '../types/get-posts-for-coin.interface';
import { FarcasterApiResponse } from '../types/farcaster-api.interface';

@Injectable()
export class FarcasterSocialProvider implements SocialProvider {
  private readonly baseUrl = 'https://searchcaster.xyz/api';

  constructor(
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
  ) {}

  async getPostsForCoin(coinName: string): Promise<GetPostsForCoinResponse> {
    try {
      const { data } = await firstValueFrom<{ data: FarcasterApiResponse }>(
        this.httpService.get(`${this.baseUrl}/search`, {
          params: { text: coinName },
        }),
      );

      return {
        posts: data.casts.map((cast) => ({
          id: cast.merkleRoot,
          text: cast.body.data.text,
          publishedAt: new Date(cast.body.publishedAt),
          author: {
            username: cast.body.username,
            displayName: cast.meta.displayName,
            avatar: cast.meta.avatar,
            isVerifiedAvatar: cast.meta.isVerifiedAvatar,
          },
          engagement: {
            reactions: cast.meta.reactions,
            recasts: cast.meta.recasts,
            watches: cast.meta.watches,
            numReplyChildren: cast.meta.numReplyChildren,
          },
          replyTo: cast.meta.replyParentUsername
            ? {
                username: cast.meta.replyParentUsername.username,
                fid: cast.meta.replyParentUsername.fid,
              }
            : undefined,
          mentions: cast.meta.mentions,
          tags: cast.meta.tags,
          embeds: cast.body.data.embeds,
          platform: SOCIAL_PLATFORM.FARCASTER,
        })),
        metadata: {
          totalPosts: data.meta.count,
          platform: SOCIAL_PLATFORM.FARCASTER,
        },
      };
    } catch (error) {
      this.loggerService.error(
        `Error fetching Farcaster posts for ${coinName}:`,
        error,
      );
      throw error;
    }
  }
}
