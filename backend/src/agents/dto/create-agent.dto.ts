import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AgentPersona } from '../enums/agent-persona.enum';
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
  @IsEnum(AgentPersona)
  persona: AgentPersona;
}
