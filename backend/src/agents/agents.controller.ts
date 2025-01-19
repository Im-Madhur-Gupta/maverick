import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateAgentResponse } from './types/create-agent.interface';
import { GetHoldingsResponse } from './types/get-holdings.interface';
import {
  createAgentDtoExample,
  createAgentResponseExample,
} from './swagger/create-agent-example';
import { getHoldingsResponseExample } from './swagger/get-holdings-example';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { AuthUser } from '../auth/types/auth-user.interface';
import { FereAgentPortfolio } from 'src/fere/types/fere-agent-portfolio.interface';
import { getPortfolioResponseExample } from './swagger/get-portfolio-example';
import { GetAgentsResponse } from './types/get-agents.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new trading agent',
  })
  @ApiBody({
    type: CreateAgentDto,
    examples: {
      example: {
        value: createAgentDtoExample,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Agent created successfully',
    content: {
      'application/json': {
        example: createAgentResponseExample,
      },
    },
  })
  createAgent(
    @Body() createAgentDto: CreateAgentDto,
    @User() user: AuthUser,
  ): Promise<CreateAgentResponse> {
    return this.agentsService.createAgent(createAgentDto, user.id);
  }

  @Get('/:agentId/holdings')
  @ApiOperation({
    summary: 'Get holdings for a given agent',
  })
  @ApiParam({
    name: 'agentId',
    description: 'Unique identifier of the agent',
    example: 'agent_123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Holdings retrieved successfully',
    content: {
      'application/json': {
        example: getHoldingsResponseExample,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent does not belong to the authenticated user',
  })
  async getHoldings(
    @Param('agentId') agentId: string,
    @User() user: AuthUser,
  ): Promise<GetHoldingsResponse> {
    return this.agentsService.getHoldings(agentId, user.id);
  }

  @Get('/:agentId/portfolio')
  @ApiOperation({
    summary: 'Get portfolio for a given agent',
  })
  @ApiParam({
    name: 'agentId',
    description: 'Unique identifier of the agent',
    example: 'agent_123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Portfolio retrieved successfully',
    content: {
      'application/json': {
        example: getPortfolioResponseExample,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent does not belong to the authenticated user',
  })
  async getPortfolio(
    @Param('agentId') agentId: string,
    @User() user: AuthUser,
  ): Promise<FereAgentPortfolio> {
    return this.agentsService.getPortfolio(agentId, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all agents for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Agents retrieved successfully',
  })
  async getAgents(@User() user: AuthUser): Promise<GetAgentsResponse> {
    return this.agentsService.getAgents(user.id);
  }
}
