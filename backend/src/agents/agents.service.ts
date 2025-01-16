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

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly fereService: FereService,
  ) {}

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
      const agent = await this.prisma.agent.findUnique({
        where: { id: agentId },
        include: {
          holdings: {
            include: { coin: true },
          },
        },
      });

      // Check if agent exists
      if (!agent) {
        throw new NotFoundException(`Agent with id ${agentId} not found`);
      }

      // Check ownership
      if (agent.ownerId !== userId) {
        this.logger.warn('Unauthorized access attempt to agent holdings', {
          agentId,
          userId,
          ownerUserId: agent.ownerId,
        });
        throw new ForbiddenException('You do not have access to this agent');
      }

      this.logger.info('Agent holdings fetched', {
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

      this.logger.error('Failed to get agent holdings', {
        agentId,
        userId,
        error,
      });
      throw new InternalServerErrorException('Failed to fetch holdings', {
        cause: error,
      });
    }
  }

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

      const agent = await this.prisma.agent.create({
        data: {
          externalId: fereAgent.id,
          name,
          description,
          persona: selectedPersona,
          ownerId: userId,
          evmAddress: fereAgent.evm_address,
          solAddress: fereAgent.sol_address,
          isActive: fereAgent.is_active,
        },
      });

      this.logger.info('Agent created successfully', {
        agentId: agent.id,
        name: agent.name,
        persona: selectedPersona,
      });

      return {
        ...agent,
        solPvtKey: fereAgent.sol_pvt_key,
        evmPvtKey: fereAgent.evm_pvt_key,
        mnemonic: fereAgent.mnemonic,
      };
    } catch (error) {
      this.logger.error('Failed to create agent', {
        error,
        dto: createAgentDto,
      });
      throw new InternalServerErrorException('Failed to create agent', {
        cause: error,
      });
    }
  }
}
