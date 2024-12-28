import { Module } from '@nestjs/common';
import { FereService } from './fere.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      proxy: false,
    }),
  ],
  providers: [FereService],
  exports: [FereService],
})
export class FereModule {}
