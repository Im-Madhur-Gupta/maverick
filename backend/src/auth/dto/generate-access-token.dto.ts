import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateAccessTokenDto {
  @ApiProperty({ description: 'Solana address of the user' })
  @IsString()
  @IsNotEmpty()
  solanaAddress: string;

  @ApiProperty({ description: 'Signature message' })
  @IsString()
  @IsNotEmpty()
  signatureMessage: string;

  @ApiProperty({
    description: 'Signature of the user on the signature message',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;
}
