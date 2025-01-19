import { Module } from '@nestjs/common';
import { FereService } from './fere.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 180_000,
      maxRedirects: 5,
      proxy: false,
    }),
  ],
  providers: [FereService],
  exports: [FereService],
})
export class FereModule {}
