import { Provider } from '@nestjs/common';
import { LlmProvider } from '../types/llm-provider.interface';
import { GeminiLlmProvider } from './gemini-llm.provider';
import { LLM_PROVIDER } from '../constants';
import { LlmType } from '../enums/llm-type.enum';

export class LlmProviderFactory {
  static createProvider(type: LlmType): Provider<LlmProvider> {
    const providers = {
      [LlmType.GEMINI]: GeminiLlmProvider,
    };

    const provider = providers[type];
    if (!provider) {
      throw new Error(`Unsupported LLM provider type: ${type}`);
    }

    return {
      provide: LLM_PROVIDER,
      useClass: provider,
    };
  }
}
