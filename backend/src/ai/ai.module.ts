import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { LlmProviderFactory } from './providers/llm-provider.factory';
import { LlmType } from './enums/llm-type.enum';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AIService, LlmProviderFactory.createProvider(LlmType.GEMINI)],
  exports: [AIService],
})
export class AIModule {}
