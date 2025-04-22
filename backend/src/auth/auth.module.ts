import { Module } from '@nestjs/common';

import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { RedisModule } from 'src/redis/redis.module';
import { UsersRedisService } from 'src/redis/services/users-redis.service';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports: [MailModule, RedisModule, UsersModule],
  providers: [AuthService, JwtStrategy, UsersRedisService],
  controllers: [AuthController],
})
export class AuthModule {}
