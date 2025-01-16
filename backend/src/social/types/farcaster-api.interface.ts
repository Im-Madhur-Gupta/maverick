export interface FarcasterApiResponse {
  casts: FarcasterCast[];
  meta: {
    count: number;
    responseTime: number;
  };
}

export interface FarcasterCast {
  body: {
    publishedAt: number;
    username: string;
    data: {
      text: string;
      image: string | null;
      embeds: {
        urls?: Array<{
          type: string;
          openGraph?: {
            url: string;
            image?: string;
            title?: string;
            domain?: string;
            description?: string;
            sourceUrl?: string;
            useLargeImage?: boolean;
          };
        }>;
        images?: Array<{
          alt?: string;
          url: string;
          type: string;
          media?: {
            width: number;
            height: number;
            version: string;
            staticRaster: string;
          };
          sourceUrl?: string;
        }>;
        videos?: any[];
        unknowns?: any[];
        groupInvites?: any[];
        processedCastText?: string;
      } | null;
      replyParentMerkleRoot?: string;
      threadMerkleRoot?: string;
    };
  };
  meta: {
    displayName: string;
    avatar: string;
    isVerifiedAvatar: boolean;
    numReplyChildren: number;
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
    replyParentUsername?: {
      fid: number;
      username: string;
    };
    mentions?: Array<{
      fid: number;
      pfp?: {
        url: string;
        verified: boolean;
      };
      username: string;
      displayName: string;
    }>;
    tags?: Array<{
      id: string;
      name: string;
      type: string;
      imageUrl?: string;
    }>;
  };
  merkleRoot: string;
  uri: string;
}
