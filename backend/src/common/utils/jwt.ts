import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

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
): JwtPayload {
  try {
    return jwtService.verify<JwtPayload>(token);
  } catch (_err) {
    throw new BadRequestException('Invalid or expired token');
  }
}
