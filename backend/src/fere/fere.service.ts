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
import { FereAgentPortfolio } from './types/fere-agent-portfolio.interface';
import {
  CreateFereSellInstructionResponse,
  FereSellQuantity,
} from './types/fere-sell-instruction.interface';
import { Chain } from 'src/common/enums/chain.enum';

@Injectable()
export class FereService {
  private readonly baseUrl: string = FERE_API_BASE_URL;
  private readonly apiKey: string;
  private readonly userId: string;
  private readonly originUrl: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.userId = this.configService.get(ENV_CONFIG_KEYS.FERE_USER_ID);
    this.apiKey = this.configService.get(ENV_CONFIG_KEYS.FERE_API_KEY);
    this.originUrl =
      this.configService.get(ENV_CONFIG_KEYS.ORIGIN_URL) || 'localhost:3000';
  }

  /**
   * Gets the common API headers required for Fere API requests
   * @returns Record of header key-value pairs
   */
  private getApiHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-FRIDAY-KEY': this.apiKey,
      'X-Fere-Userid': this.userId,
      Origin: this.originUrl,
    };
  }

  /**
   * Creates a new Fere trading agent with specified configuration
   * @param createFereAgentDto - The configuration for the new agent
   * @returns Promise containing the created agent's details
   */
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
        // TODO: Implement multi-chain agent deployment
        chain: Chain.SOLANA,
      };

      const url = `${this.baseUrl}/agent/`;
      const { data } = await firstValueFrom(
        this.httpService.put<CreateFereAgentResponse>(url, payload, {
          headers: this.getApiHeaders(),
        }),
      );

      this.loggerService.info('Fere agent created', {
        id: data.id,
      });

      return data;
    } catch (error) {
      this.loggerService.error('Failed to create Fere agent', { error });
      throw error;
    }
  }

  /**
   * Retrieves the current holdings for a specific Fere agent
   * @param agentId - The unique identifier of the agent
   * @returns Promise containing an array of the agent's holdings
   */
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
      this.loggerService.error('Failed to get Fere agent holdings', {
        agentId,
        error,
      });
      throw error;
    }
  }

  /**
   * Retrieves the portfolio details for a specific Fere agent
   * @param agentId - The unique identifier of the agent
   * @returns Promise containing the agent's portfolio information
   */
  async getPortfolio(agentId: string): Promise<FereAgentPortfolio> {
    try {
      const url = `${this.baseUrl}/agent/${agentId}/portfolio/`;
      const { data } = await firstValueFrom(
        this.httpService.get<FereAgentPortfolio>(url, {
          headers: this.getApiHeaders(),
        }),
      );

      return data;
    } catch (error) {
      this.loggerService.error('Failed to get Fere agent portfolio', {
        agentId,
        error,
      });
      throw error;
    }
  }

  /**
   * Creates a sell instruction for a specific holding of a Fere agent
   * @param agentId - The unique identifier of the agent
   * @param holdingId - The unique identifier of the holding to sell
   * @param quantity - The amount to sell in Lamports (1 SOL = 1,000,000,000 Lamports) or 'all' to sell entire holding
   * @returns Promise containing the task ID for tracking the sell instruction
   */
  async createSellInstruction(
    agentId: string,
    holdingId: string,
    quantity: FereSellQuantity,
  ): Promise<CreateFereSellInstructionResponse> {
    try {
      const url = `${this.baseUrl}/agent/${agentId}/sell/${holdingId}/${quantity}/`;
      const { data } = await firstValueFrom(
        this.httpService.post<CreateFereSellInstructionResponse>(url, null, {
          headers: this.getApiHeaders(),
        }),
      );

      this.loggerService.info('Created sell instruction for Fere agent', {
        agentId,
        holdingId,
        quantity,
        taskId: data.task_id,
      });

      return data;
    } catch (error) {
      this.loggerService.error(
        'Failed to create sell instruction for Fere agent',
        {
          agentId,
          holdingId,
          quantity,
          error,
        },
      );
      throw error;
    }
  }
}
