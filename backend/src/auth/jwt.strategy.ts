import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { required } from 'src/config/env.utils';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: required('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return { sub: payload.sub, email: payload.email };
  }
}
