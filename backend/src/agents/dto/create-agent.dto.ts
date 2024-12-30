import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { AgentPersona } from '../types/agent-persona.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ description: 'Name of the agent' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the agent' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Persona of the agent', enum: AgentPersona })
  @IsIn([
    AgentPersona.MOON_CHASER,
    AgentPersona.MEME_LORD,
    AgentPersona.WHALE_WATCHER,
  ])
  persona: AgentPersona;

  @ApiProperty({ description: 'Owner address of the agent' })
  @IsString()
  @IsNotEmpty()
  ownerAddress: string;
}
