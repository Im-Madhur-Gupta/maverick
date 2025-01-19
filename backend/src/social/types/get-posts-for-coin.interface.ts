import { SOCIAL_PLATFORM } from '../enums/social-platform.enum';
import { SocialPost } from './social-post.interface';

export interface GetPostsForCoinResponse {
  posts: SocialPost[];
  metadata: {
    totalPosts: number;
    platform: SOCIAL_PLATFORM;
  };
}
