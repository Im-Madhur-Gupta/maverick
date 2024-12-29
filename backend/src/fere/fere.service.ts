import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from 'libs/logger/src';
import { CreateFereAgentDto } from './dto/create-fere-agent.dto';
import { CreateFereAgentResponse } from './types/create-fere-agent.interface';
import { firstValueFrom } from 'rxjs';
import { GetFereAgentHoldingsResponse } from './types/get-fere-agent-holdings.interface';

@Injectable()
export class FereService {
  private readonly baseUrl: string = 'https://api.fereai.xyz/ta/agent/';
  private readonly userId: string = process.env.FERE_USER_ID;

  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
  ) {}

  private getReadApiHeaders(): Record<string, string> {
    return {
      'X-Fere-Userid': this.userId,
    };
  }

  private getWriteApiHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-FRIDAY-KEY': process.env.FERE_API_KEY,
      'X-Fere-Userid': this.userId,
      Origin: process.env.FRONTEND_URL || 'localhost:3000',
    };
  }

  async createAgent(
    createFereAgentDto: CreateFereAgentDto,
  ): Promise<CreateFereAgentResponse> {
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

    try {
      const { data } = await firstValueFrom(
        this.httpService.put<CreateFereAgentResponse>(this.baseUrl, payload, {
          headers: this.getWriteApiHeaders(),
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

  async getHoldings(agentId: string): Promise<GetFereAgentHoldingsResponse> {
    const url = `${this.baseUrl}/${agentId}/holdings/`;
    const { data } = await firstValueFrom(
      this.httpService.get<GetFereAgentHoldingsResponse>(url, {
        headers: this.getReadApiHeaders(),
      }),
    );
    return data;
  }
}
