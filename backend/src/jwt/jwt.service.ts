import { randomUUID } from 'crypto';

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { JwtExpiresIn } from './constants/jwt-expires-in.constant';
import { JwtPurpose } from './constants/jwt-purpose.constant';
import { JwtPayload, JwtPayloadBase } from './types/jwt-payload.type';

import { JwtRedisService } from '../redis/jwt-redis.service';

@Injectable()
export class AppJwtService {
  public constructor(
    private readonly jwt: NestJwtService,
    private readonly jwtRedis: JwtRedisService,
  ) {}

  public sign(payloadBase: JwtPayloadBase, expiresIn: JwtExpiresIn): string {
    const payload: JwtPayload = { ...payloadBase, jti: randomUUID() };
    return this.jwt.sign(payload, { expiresIn });
  }

  public async verify(token: string, purpose: JwtPurpose): Promise<JwtPayload> {
    const payload = this.verifyStructure(token);
    this.ensureExpectedPurpose(payload.purpose, purpose);
    await this.ensureTokenNotUsed(payload.jti);
    return payload;
  }

  public async markAsUsed(jti: string, expiresIn: JwtExpiresIn): Promise<void> {
    const seconds = this.parseExpiresInToSeconds(expiresIn);
    await this.jwtRedis.markJtiAsUsed(jti, seconds);
  }

  // Aux
  public ensureExpectedPurpose(actual: JwtPurpose, expected: JwtPurpose): void {
    if (actual !== expected)
      throw new UnauthorizedException('Invalid token purpose');
  }

  private async ensureTokenNotUsed(jti: string): Promise<void> {
    const isUsed = await this.jwtRedis.isJtiUsed(jti);
    if (isUsed) throw new UnauthorizedException('Token has already been used');
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

  private parseExpiresInToSeconds(expiresIn: JwtExpiresIn): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error('Invalid expiresIn format');

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error('Unsupported expiresIn unit');
    }
  }
}
