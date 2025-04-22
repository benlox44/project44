import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class JwtRedisService {
  public constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  public async isJtiUsed(jti: string): Promise<boolean> {
    return (await this.redis.exists(`used:jti:${jti}`)) === 1;
  }

  public async markJtiAsUsed(
    jti: string,
    expiresInSeconds: number,
  ): Promise<void> {
    await this.redis.setex(`used:jti:${jti}`, expiresInSeconds, '1');
  }
}
