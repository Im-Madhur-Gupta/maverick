import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateSignatureMessageDto {
  @ApiProperty({ description: 'Solana address of the user' })
  @IsString()
  @IsNotEmpty()
  solanaAddress: string;
}
