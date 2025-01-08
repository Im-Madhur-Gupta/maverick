import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from 'libs/logger/src/logger.service';
import { CreateFereAgentDto } from './dto/create-fere-agent.dto';
import { CreateFereAgentResponse } from './types/create-fere-agent.interface';
import { firstValueFrom } from 'rxjs';
import { FereAgentHolding } from './types/fere-agent-holdings.interface';
import { ConfigService } from '@nestjs/config';
import { ENV_CONFIG_KEYS } from 'src/common/config/env.config';
import { FERE_API_BASE_URL } from './constants';

@Injectable()
export class FereService {
  private readonly baseUrl: string = FERE_API_BASE_URL;
  private readonly apiKey: string;
  private readonly userId: string;
  private readonly originUrl: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userId = this.configService.get(ENV_CONFIG_KEYS.FERE_USER_ID);
    this.apiKey = this.configService.get(ENV_CONFIG_KEYS.FERE_API_KEY);
    this.originUrl =
      this.configService.get(ENV_CONFIG_KEYS.ORIGIN_URL) || 'localhost:3000';
  }

  private getApiHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-FRIDAY-KEY': this.apiKey,
      'X-Fere-Userid': this.userId,
      Origin: this.originUrl,
    };
  }

  async createAgent(
    createFereAgentDto: CreateFereAgentDto,
  ): Promise<CreateFereAgentResponse> {
    try {
      const {
        name,
        description,
        personaPrompt,
        decisionPromptPool,
        decisionPromptPortfolio,
      } = createFereAgentDto;

      const payload = {
        user_id: this.userId,
        name,
        description,
        persona: personaPrompt,
        data_source: 'trending',
        decision_prompt_pool: decisionPromptPool,
        decision_prompt_portfolio: decisionPromptPortfolio,
        dry_run: true,
        dry_run_initial_usd: 1000,
        max_investment_per_session: 0.2,
        stop_loss: 0.5,
        trailing_stop_loss: 0.3,
        take_profit: 1.0,
      };

      const url = `${this.baseUrl}/agent/`;
      const { data } = await firstValueFrom(
        this.httpService.put<CreateFereAgentResponse>(url, payload, {
          headers: this.getApiHeaders(),
        }),
      );

      this.logger.info('Fere agent created', {
        id: data.id,
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create Fere agent', { error });
      throw error;
    }
  }

  async getHoldings(agentId: string): Promise<FereAgentHolding[]> {
    try {
      const url = `${this.baseUrl}/agent/${agentId}/holdings/`;
      const { data } = await firstValueFrom(
        this.httpService.get<FereAgentHolding[]>(url, {
          headers: this.getApiHeaders(),
        }),
      );

      return data;
    } catch (error) {
      this.logger.error('Failed to get Fere agent holdings', {
        agentId,
        error,
      });
      throw error;
    }
  }
}
