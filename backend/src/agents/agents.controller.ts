import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateAgentResponse } from './types/create-agent.interface';
import { GetHoldingsResponse } from './types/get-holdings.interface';
import {
  createAgentExample,
  createAgentResponseExample,
} from './swagger/create-agent-example';
import { getHoldingsResponseExample } from './swagger/get-holdings-example';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

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
  async getHoldings(
    @Param('agentId') agentId: string,
  ): Promise<GetHoldingsResponse> {
    return this.agentsService.getHoldings(agentId);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Create a new trading agent',
  })
  @ApiBody({
    type: CreateAgentDto,
    examples: {
      example: {
        value: createAgentExample,
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
  ): Promise<CreateAgentResponse> {
    return this.agentsService.createAgent(createAgentDto);
  }
}
