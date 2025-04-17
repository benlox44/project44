import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { required } from 'src/config/env.utils';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: required('JWT_SECRET'),
      signOptions: {expiresIn: '1d'},
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
