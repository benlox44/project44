import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

export function verifyTokenOrThrow(jwtService: JwtService, token: string): any {
  try {
    return jwtService.verify(token);
  } catch (err) {
    throw new BadRequestException('Invalid or expired token');
  }
}
