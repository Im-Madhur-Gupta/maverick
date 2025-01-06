import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../types/auth-user.interface';

export const User = createParamDecorator<unknown, ExecutionContext, AuthUser>(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
