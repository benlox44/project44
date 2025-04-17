import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller'; // ✅ Agregado
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { required } from './config/env.utils';

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
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
