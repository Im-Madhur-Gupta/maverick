import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoggerService } from 'libs/logger/src';
import { PrismaService } from 'libs/prisma/src';
import { FereService } from '../fere/fere.service';
import { getPersonaStrings } from './utils';
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
   * Retrieves holdings for a given agent.
   * @param agentId - The unique identifier of the agent.
   * @returns A promise that resolves to the agent's holdings.
   */
  async getHoldings(agentId: string): Promise<GetHoldingsResponse> {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: { id: agentId },
      });

      // Check if agent exists
      if (!agent) {
        throw new NotFoundException(`Agent with id ${agentId} not found`);
      }

      // Get holdings for agent
      const holdings = await this.prisma.holding.findMany({
        where: { agentId },
        include: { coin: true },
        omit: { externalId: true },
      });

      this.logger.info('Agent holdings fetched', { agentId, holdings });
      return holdings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to get agent holdings', { agentId, error });
      throw new InternalServerErrorException('Failed to fetch holdings', {
        cause: error,
      });
    }
  }

  /**
   * Creates a new agent.
   * @param createAgentDto - The data transfer object containing agent details.
   * @returns A promise that resolves to the created agent's response.
   * @throws BadRequestException if the persona is invalid.
   * @throws InternalServerErrorException if agent creation fails.
   */
  async createAgent(
    createAgentDto: CreateAgentDto,
  ): Promise<CreateAgentResponse> {
    const { name, description, persona: selectedPersona } = createAgentDto;
    const ownerId = 0; // TODO: Retrieve ownerId from the request object, which should be populated by the auth guard

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
          ownerId,
          evmAddress: fereAgent.evm_address,
          solAddress: fereAgent.sol_address,
          isActive: fereAgent.is_active,
        },
        omit: { externalId: true },
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
