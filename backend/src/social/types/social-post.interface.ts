import { SOCIAL_PLATFORM } from '../enums/social-platform.enum';

export interface SocialPost {
  id: string;
  text: string;
  publishedAt: Date;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
    isVerifiedAvatar?: boolean;
  };
  engagement: {
    reactions: {
      count: number;
      type: string;
    };
    recasts: {
      count: number;
    };
    watches: {
      count: number;
    };
    numReplyChildren: number;
  };
  replyTo?: {
    username: string;
    fid: number;
  };
  mentions?: Array<{
    username: string;
    displayName: string;
    fid: number;
    pfp?: {
      url: string;
      verified: boolean;
    };
  }>;
  tags?: Array<{
    id: string;
    name: string;
    type: string;
    imageUrl?: string;
  }>;
  embeds?: {
    urls?: Array<{
      type: string;
      openGraph?: {
        url: string;
        image?: string;
        title?: string;
        domain?: string;
        description?: string;
      };
    }>;
    images?: Array<{
      url: string;
      type: string;
      alt?: string;
    }>;
  };
  platform: SOCIAL_PLATFORM;
}
