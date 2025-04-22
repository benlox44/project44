import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest } from '../../auth/interfaces/auth-request.interface';
import { JwtPayload } from '../types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
