import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  generateNonceValue,
  generateNonceExpiresAt,
  generateSignatureMessage,
  extractNonceValue,
} from './utils/nonce.utils';
import { verifySolanaSignature } from './utils/signature.utils';
import { GenerateSignatureMessageDto } from './dto/generate-signature-message.dto';
import { GenerateSignatureMessageResponse } from './types/generate-signature-message.interface';
import { GenerateAccessTokenDto } from './dto/generate-access-token.dto';
import { GenerateAccessTokenResponse } from './types/generate-access-token.interface';
import { JwtPayload } from './types/jwt-payload.interface';
import { LoggerService } from 'libs/logger/src/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateSignatureMessage(
    generateSignatureMessageDto: GenerateSignatureMessageDto,
  ): Promise<GenerateSignatureMessageResponse> {
    const { solanaAddress } = generateSignatureMessageDto;
    try {
      const nonceValue = await this.prismaService.$transaction(async (tx) => {
        // Ensure user exists
        const user = await tx.user.upsert({
          where: { solanaAddress },
          update: {},
          create: { solanaAddress },
        });

        // Create nonce for user
        const nonce = await tx.nonce.create({
          data: {
            value: generateNonceValue(),
            expiresAt: generateNonceExpiresAt(),
            userId: user.id,
          },
        });

        return nonce.value;
      });

      const message = generateSignatureMessage(nonceValue);

      this.loggerService.info(
        `Generated signature message for user ${solanaAddress}: ${message}`,
      );

      return {
        message,
      };
    } catch (error) {
      this.loggerService.error(
        `Failed to generate signature message for user ${solanaAddress}: ${error}`,
      );
      throw new InternalServerErrorException(
        'Failed to generate signature message',
        {
          cause: error,
        },
      );
    }
  }

  async generateAccessToken(
    generateAccessTokenDto: GenerateAccessTokenDto,
  ): Promise<GenerateAccessTokenResponse> {
    const { solanaAddress, signatureMessage, signature } =
      generateAccessTokenDto;
    try {

      // Extract nonceValue from signatureMessage string
      const nonceValue = extractNonceValue(signatureMessage);

      // Fetch user and associated nonce given the nonceValue
      const user = await this.prismaService.user.findUnique({
        where: { solanaAddress },
        include: {
          nonces: {
            where: {
              value: nonceValue,
              usedAt: null,
              expiresAt: { gt: new Date() },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.nonces.length === 0) {
        throw new UnauthorizedException('Invalid or expired nonce');
      }

      const nonce = user.nonces[0];

      const isSignatureValid = await verifySolanaSignature(
        signatureMessage,
        signature,
        solanaAddress,
      );

      if (!isSignatureValid) {
        throw new UnauthorizedException('Invalid signature');
      }

      // Mark the used nonce by updating 'usedAt' field
      await this.prismaService.nonce.update({
        where: { id: nonce.id },
        data: { usedAt: new Date() },
      });

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        solanaAddress,
      };
      const accessToken = this.jwtService.sign(payload);

      this.loggerService.info(
        `Generated access token for user ${solanaAddress}: ${accessToken}`,
      );

      return {
        accessToken,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      this.loggerService.error(
        `Failed to generate access token for user ${solanaAddress}: ${error}`,
      );

      throw new InternalServerErrorException(
        'Failed to generate access token',
        {
          cause: error,
        },
      );
    }
  }
}
