import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest } from '../interfaces/auth-request.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
