import { Module } from '@nestjs/common';

import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports: [MailModule, UsersModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
