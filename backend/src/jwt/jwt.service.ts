import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { JwtExpiresIn } from './constants/jwt-expires-in.constant';
import { JwtPurpose } from './constants/jwt-purpose.constant';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AppJwtService {
  public constructor(private readonly jwt: NestJwtService) {}

  public sign(payload: JwtPayload, expiresIn: JwtExpiresIn): string {
    return this.jwt.sign(payload, { expiresIn });
  }

  public verify(token: string, purpose: JwtPurpose): JwtPayload {
    const payload = this.verifyStructure(token);
    this.ensureExpectedPurpose(payload.purpose, purpose);
    return payload;
  }

  // Aux
  public ensureExpectedPurpose(actual: JwtPurpose, expected: JwtPurpose): void {
    if (actual !== expected)
      throw new UnauthorizedException('Token purpose mismatch');
  }

  private verifyStructure(token: string): JwtPayload {
    if (!token?.trim()) {
      throw new BadRequestException('Token is required');
    }

    try {
      return this.jwt.verify<JwtPayload>(token);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
