import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { LOGIN_BLOCK } from 'src/common/constants/login-block.constant';

@Injectable()
export class UsersRedisService {
  public constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private getKey(email: string): string {
    return `fail-login:${email}`;
  }

  public async incrementFailures(email: string): Promise<number> {
    const key = this.getKey(email);
    const count = await this.redis.incr(key);
    if (count === 1)
      await this.redis.expire(key, LOGIN_BLOCK.BLOCK_TIME_SECONDS);
    return count;
  }

  public async resetFailures(email: string): Promise<void> {
    await this.redis.del(this.getKey(email));
  }
}
