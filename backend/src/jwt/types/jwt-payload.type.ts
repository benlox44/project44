import { JwtPurpose } from '../../common/constants/jwt-purpose.constant';

export type JwtPayloadBase = {
  purpose: JwtPurpose;
  sub: number;
  email: string;
};

export type JwtPayload = JwtPayloadBase & {
  jti: string;
};
