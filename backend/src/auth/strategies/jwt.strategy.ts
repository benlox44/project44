import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { required } from 'src/common/config/env.utils';
import { JWT_PURPOSE } from 'src/common/constants/jwt-purpose';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: required('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (payload.purpose !== JWT_PURPOSE.SESSION)
      throw new UnauthorizedException('Invalid token purpose');
    return payload;
  }
}
