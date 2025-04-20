import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { required } from './common/config/env.utils';
import { GlobalJwtModule } from './common/config/jwt.module';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
