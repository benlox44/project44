import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { required } from './common/config/env.config';
import { GlobalJwtModule } from './jwt/jwt.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: required('DATABASE_HOST'),
      port: parseInt(required('DATABASE_PORT'), 10),
      username: required('DATABASE_USER'),
      password: required('DATABASE_PASSWORD'),
      database: required('DATABASE_NAME'),
      entities: [User],
      synchronize: true, // ⚠️ Disable this in production!
    }),
    GlobalJwtModule,
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
