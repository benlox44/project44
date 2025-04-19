import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

export function verifyTokenOrThrow(jwtService: JwtService, token: string): JwtPayload {
  try {
    return jwtService.verify<JwtPayload>(token);
  } catch (_err) {
    throw new BadRequestException('Invalid or expired token');
  }
}

export function signToken(
  jwtService: JwtService,
  payload: JwtPayload,
  expiresIn: string = '1d',
): string {
  return jwtService.sign(payload, { expiresIn });
}
