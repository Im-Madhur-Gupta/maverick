import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'libs/logger/src/logger.service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { LlmProvider } from '../types/llm-provider.interface';
import { ENV_CONFIG_KEYS } from 'src/common/config/env.config';

@Injectable()
export class GeminiLlmProvider implements LlmProvider {
  private readonly llm: ChatGoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    this.llm = new ChatGoogleGenerativeAI({
      apiKey: this.configService.get(ENV_CONFIG_KEYS.GOOGLE_GEMINI_API_KEY),
      temperature: 0,
      model: 'gemini-2.0-flash-exp',
    });
  }

  async getStructuredResponse<T>(
    prompt: string,
    schema: z.Schema<T>,
  ): Promise<T> {
    try {
      if (!prompt.trim()) {
        throw new Error('Prompt cannot be empty');
      }

      const structuredLlm = this.llm.withStructuredOutput(schema);
      const response = await structuredLlm.invoke(prompt);

      return response;
    } catch (error) {
      this.logger.error(`Failed to get structured response: ${error.message}`, {
        prompt,
        error,
      });
      throw error;
    }
  }
}
