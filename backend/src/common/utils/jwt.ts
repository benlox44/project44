import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { JwtPurpose } from '../constants/jwt-purpose';

export function signToken(
  jwtService: JwtService,
  payload: JwtPayload,
  expiresIn: string,
): string {
  return jwtService.sign(payload, { expiresIn });
}

export function verifyTokenOrThrow(
  jwtService: JwtService,
  token: string,
  purpose: JwtPurpose,
): JwtPayload {
  if (!token || token.trim() === '') {
    throw new BadRequestException('Token is required');
  }

  let payload: JwtPayload;

  try {
    payload = jwtService.verify<JwtPayload>(token);
  } catch {
    throw new BadRequestException('Invalid or expired token');
  }

  if (!payload.purpose || payload.purpose !== purpose)
    throw new BadRequestException('Invalid token purpose');

  return payload;
}
