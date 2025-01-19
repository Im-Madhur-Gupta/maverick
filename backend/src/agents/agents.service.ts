import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { LoggerService } from 'libs/logger/src/logger.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { FereService } from '../fere/fere.service';
import { getPersonaStrings } from './utils/persona.utils';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateAgentResponse } from './types/create-agent.interface';
import { GetHoldingsResponse } from './types/get-holdings.interface';
import { FereAgentPortfolio } from 'src/fere/types/fere-agent-portfolio.interface';
import { GetAgentsResponse } from './types/get-agents.interface';

@Injectable()
export class AgentsService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly fereService: FereService,
  ) {}

  /**
   * Creates a new agent.
   * @param createAgentDto - The data transfer object containing agent details.
   * @param userId - The ID of the user creating the agent.
   * @returns A promise that resolves to the created agent's response.
   * @throws BadRequestException if the persona is invalid.
   * @throws InternalServerErrorException if agent creation fails.
   */
  async createAgent(
    createAgentDto: CreateAgentDto,
    userId: number,
  ): Promise<CreateAgentResponse> {
    const { name, description, persona: selectedPersona } = createAgentDto;

    try {
      const { personaPrompt, decisionPromptPool, decisionPromptPortfolio } =
        getPersonaStrings(selectedPersona);

      const fereAgent = await this.fereService.createAgent({
        name,
        description,
        personaPrompt,
        decisionPromptPool,
        decisionPromptPortfolio,
      });

      const agent = await this.prismaService.agent.create({
        data: {
          externalId: fereAgent.id,
          name,
          description,
          persona: selectedPersona,
          solanaAddress: fereAgent.wallet.address,
          isActive: fereAgent.is_active,
          ownerId: userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          persona: true,
          solanaAddress: true,
          isActive: true,
          createdAt: true,
          owner: {
            select: {
              solanaAddress: true,
              createdAt: true,
            },
          },
        },
      });

      this.loggerService.info('Agent created successfully', {
        agentId: agent.id,
        name: agent.name,
        persona: selectedPersona,
      });

      return {
        ...agent,
        solanaPvtKey: fereAgent.wallet.pvt_key,
      };
    } catch (error) {
      this.loggerService.error('Failed to create agent', {
        error,
        dto: createAgentDto,
      });
      throw new InternalServerErrorException('Failed to create agent', {
        cause: error,
      });
    }
  }

  /**
   * Retrieves holdings for a given agent after verifying ownership.
   * @param agentId - The unique identifier of the agent.
   * @param userId - The ID of the user requesting the holdings.
   * @returns A promise that resolves to the agent's holdings.
   * @throws NotFoundException if agent doesn't exist
   * @throws ForbiddenException if user doesn't own the agent
   */
  async getHoldings(
    agentId: string,
    userId: number,
  ): Promise<GetHoldingsResponse> {
    try {
      const agent = await this.prismaService.agent.findUnique({
        where: { id: agentId },
        select: {
          ownerId: true,
          holdings: {
            select: {
              boughtAt: true,
              tokensBought: true,
              buyingPriceUsd: true,
              currPriceUsd: true,
              profitAbsUsd: true,
              profitPerUsd: true,
              isActive: true,
              dryRun: true,
              coin: {
                select: {
                  baseAddress: true,
                  tokenName: true,
                  decimals: true,
                  poolName: true,
                  poolAddress: true,
                },
              },
            },
          },
        },
      });

      // Check if agent exists
      if (!agent) {
        throw new NotFoundException(`Agent with id ${agentId} not found`);
      }

      // Check ownership
      if (agent.ownerId !== userId) {
        this.loggerService.warn(
          'Unauthorized access attempt to agent holdings',
          {
            agentId,
            userId,
            ownerUserId: agent.ownerId,
          },
        );
        throw new ForbiddenException('You do not have access to this agent');
      }

      this.loggerService.info('Agent holdings fetched', {
        agentId,
        holdings: agent.holdings,
      });
      return {
        holdings: agent.holdings,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      this.loggerService.error('Failed to get agent holdings', {
        agentId,
        userId,
        error,
      });
      throw new InternalServerErrorException('Failed to fetch holdings', {
        cause: error,
      });
    }
  }

  async getPortfolio(
    agentId: string,
    userId: number,
  ): Promise<FereAgentPortfolio> {
    try {
      const agent = await this.prismaService.agent.findUnique({
        where: { id: agentId },
      });

      // Check if agent exists
      if (!agent) {
        throw new NotFoundException(`Agent with id ${agentId} not found`);
      }

      // Check ownership
      if (agent.ownerId !== userId) {
        this.loggerService.warn(
          'Unauthorized access attempt to agent holdings',
          {
            agentId,
            userId,
            ownerUserId: agent.ownerId,
          },
        );
        throw new ForbiddenException('You do not have access to this agent');
      }

      return this.fereService.getPortfolio(agent.externalId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      this.loggerService.error('Failed to get Fere agent portfolio', {
        agentId,
        error,
      });
      throw error;
    }
  }

  async getAgents(userId: number): Promise<GetAgentsResponse> {
    try {
      const agents = await this.prismaService.agent.findMany({
        where: { ownerId: userId },
        select: {
          id: true,
          name: true,
          description: true,
          persona: true,
          solanaAddress: true,
          isActive: true,
          createdAt: true,
          owner: {
            select: {
              solanaAddress: true,
              createdAt: true,
            },
          },
        },
      });

      this.loggerService.info('User agents fetched successfully', {
        userId,
        agentCount: agents.length,
      });

      return { agents };
    } catch (error) {
      this.loggerService.error('Failed to fetch user agents', {
        userId,
        error,
      });
      throw new InternalServerErrorException('Failed to fetch user agents', {
        cause: error,
      });
    }
  }
}
