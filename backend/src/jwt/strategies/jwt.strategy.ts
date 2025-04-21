import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { required } from 'src/common/config/env.config';
import { JWT_PURPOSE } from 'src/jwt/constants/jwt-purpose.constant';

import { AppJwtService } from '../jwt.service';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly jwtService: AppJwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: required('JWT_SECRET'),
    });
  }

  public validate(payload: JwtPayload): JwtPayload {
    this.jwtService.ensureExpectedPurpose(payload.purpose, JWT_PURPOSE.SESSION);
    return payload;
  }
}
