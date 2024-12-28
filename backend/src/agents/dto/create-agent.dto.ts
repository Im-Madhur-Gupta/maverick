import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { AgentPersona } from '../types/agent-persona.enum';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn([
    AgentPersona.MOON_CHASER,
    AgentPersona.MEME_LORD,
    AgentPersona.WHALE_WATCHER,
  ])
  persona: AgentPersona;

  @IsString()
  @IsNotEmpty()
  ownerAddress: string;
}
