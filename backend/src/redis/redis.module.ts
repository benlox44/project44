import { Module } from '@nestjs/common';

import { RedisProvider } from './redis.provider';
import { JwtRedisService } from './services/jwt-redis.service';
import { UsersRedisService } from './services/users-redis.service';

@Module({
  providers: [RedisProvider, JwtRedisService, UsersRedisService],
  exports: [RedisProvider, JwtRedisService, UsersRedisService],
})
export class RedisModule {}
