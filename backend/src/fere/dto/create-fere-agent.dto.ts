import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFereAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  personaPrompt: string;

  @IsString()
  @IsNotEmpty()
  decisionPromptPool: string;

  @IsString()
  @IsNotEmpty()
  decisionPromptPortfolio: string;
}
