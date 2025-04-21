import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '../../jwt/types/jwt-payload.type';
import { AuthRequest } from '../interfaces/auth-request.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
