import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocialService } from './social.service';
import { FarcasterSocialProvider } from './providers/farcaster-social.provider';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  providers: [SocialService, FarcasterSocialProvider],
  exports: [SocialService],
})
export class SocialModule {}
