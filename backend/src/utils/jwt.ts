import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

interface Payload {
  sub: number;
  email: string;
}

export function verifyTokenOrThrow(jwtService: JwtService, token: string): any {
  try {
    return jwtService.verify(token);
  } catch (err) {
    throw new BadRequestException('Invalid or expired token');
  }
}

export function signToken(jwtService: JwtService, payload: Payload, expiresIn: string = '1d'): string {
  return jwtService.sign(payload, { expiresIn });
}