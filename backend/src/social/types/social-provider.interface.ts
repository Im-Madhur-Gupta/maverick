import { GetPostsForCoinResponse } from './get-posts-for-coin.interface';

export interface SocialProvider {
  getPostsForCoin(coinName: string): Promise<GetPostsForCoinResponse>;
}
