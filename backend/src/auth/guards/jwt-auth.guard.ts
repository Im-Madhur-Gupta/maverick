import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthUser } from '../types/auth-user.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T = AuthUser>(err: any, user: T, info: Error | object): T {
    if (info instanceof Error) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token has expired');
      }
      if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid access token');
      }
    }

    if (err || !user) {
      throw new UnauthorizedException('No access token provided');
    }

    return user as T;
  }
}
