import { IsString, IsNotEmpty } from 'class-validator';

export class SyncAgentHoldingsDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}
