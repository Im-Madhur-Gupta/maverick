import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateAgentResponse } from './types/create-agent.interface';
import { GetHoldingsResponse } from './types/get-holdings.interface';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new trading agent' })
  createAgent(
    @Body() createAgentDto: CreateAgentDto,
  ): Promise<CreateAgentResponse> {
    return this.agentsService.createAgent(createAgentDto);
  }

  @Get('/:agentId/holdings')
  @ApiOperation({ summary: 'Get holdings for a given agent' })
  async getHoldings(
    @Param('agentId') agentId: string,
  ): Promise<GetHoldingsResponse> {
    return this.agentsService.getHoldings(agentId);
  }
}
