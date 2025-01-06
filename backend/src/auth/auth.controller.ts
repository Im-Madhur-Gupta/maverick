import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateSignatureMessageDto } from './dto/generate-signature-message.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GenerateSignatureMessageResponse } from './types/generate-signature-message.interface';
import {
  generateMessageSignatureDtoExample,
  generateMessageSignatureResponseExample,
} from './swagger/generate-message-signature-example';
import { GenerateAccessTokenDto } from './dto/generate-access-token.dto';
import { GenerateAccessTokenResponse } from './types/generate-access-token.interface';
import { generateAccessTokenDtoExample } from './swagger/generate-access-token-example';
import { generateAccessTokenResponseExample } from './swagger/generate-access-token-example';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/generate-signature-message')
  @ApiOperation({
    summary:
      'Generate a signature message for a given solana address. This message is to be signed by the user and sent to the server to authenticate and generate a JWT token.',
  })
  @ApiBody({
    type: GenerateSignatureMessageDto,
    examples: {
      example: {
        value: generateMessageSignatureDtoExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Signature message generated successfully',
    content: {
      'application/json': {
        example: generateMessageSignatureResponseExample,
      },
    },
  })
  async generateSignatureMessage(
    @Body() generateSignatureMessageDto: GenerateSignatureMessageDto,
  ): Promise<GenerateSignatureMessageResponse> {
    return this.authService.generateSignatureMessage(
      generateSignatureMessageDto,
    );
  }

  @Post('/generate-access-token')
  @ApiOperation({
    summary:
      'Generate an access token for a given solana address. Signature will verified against the latest nonce for the supplied solana address. The access token is used to authenticate the user in the backend.',
  })
  @ApiBody({
    type: GenerateAccessTokenDto,
    examples: {
      example: {
        value: generateAccessTokenDtoExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Access token generated successfully',
    content: {
      'application/json': {
        example: generateAccessTokenResponseExample,
      },
    },
  })
  async generateAccessToken(
    @Body() generateAccessTokenDto: GenerateAccessTokenDto,
  ): Promise<GenerateAccessTokenResponse> {
    return this.authService.generateAccessToken(generateAccessTokenDto);
  }
}
