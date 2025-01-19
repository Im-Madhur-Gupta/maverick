import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { AuthUser } from '../auth/types/auth-user.interface';
import { CoinSignalService } from './coin-signal.service';
import { GetProcessedSignalsResponse } from './types/get-processed-signals.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coin-signals')
export class CoinSignalController {
  constructor(private readonly coinSignalService: CoinSignalService) {}

  @Get('/:agentId')
  @ApiOperation({
    summary: 'Get processed coin signals for an agent',
  })
  @ApiParam({
    name: 'agentId',
    description: 'Unique identifier of the agent',
    example: 'agent_123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Processed signals retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Agent does not belong to the user',
  })
  getProcessedSignals(
    @Param('agentId') agentId: string,
    @User() user: AuthUser,
  ): Promise<GetProcessedSignalsResponse> {
    return this.coinSignalService.getProcessedSignals(agentId, user.id);
  }
}
