import { JwtPurpose } from '../constants/jwt-purpose.constant';

export type JwtPayloadBase = {
  purpose: JwtPurpose;
  sub: number;
  email: string;
};

export type JwtPayload = JwtPayloadBase & {
  jti: string;
};
