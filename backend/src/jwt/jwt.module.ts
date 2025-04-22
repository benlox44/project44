import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { required } from 'src/common/config/env.config';
import { RedisModule } from 'src/redis/redis.module';

import { AppJwtService } from './jwt.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: required('JWT_SECRET'),
    }),
    RedisModule,
  ],
  providers: [AppJwtService],
  exports: [AppJwtService, JwtModule],
})
export class GlobalJwtModule {}
