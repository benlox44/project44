import { JwtPurpose } from '../constants/jwt-purpose.constant';

export type JwtPayload = {
  purpose: JwtPurpose;
  sub: number;
  email: string;
};
