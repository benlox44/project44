import { Module } from '@nestjs/common';

import { JwtRedisService } from './jwt-redis.service';
import { RedisProvider } from './redis.provider';

@Module({
  providers: [RedisProvider, JwtRedisService],
  exports: [RedisProvider, JwtRedisService],
})
export class RedisModule {}
