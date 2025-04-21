import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { authConfig } from 'src/common/config/auth.config';
import { JWT_PURPOSE } from 'src/common/constants/jwt-purpose';
import { sendRevertEmailChange } from 'src/common/mail/mail.service';
import { signToken, verifyTokenOrThrow } from 'src/common/utils/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Get
  async confirmEmail(token: string): Promise<void> {
    const payload = verifyTokenOrThrow(
      this.jwtService,
      token,
      JWT_PURPOSE.CONFIRM_EMAIL,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.isEmailConfirmed)
      throw new BadRequestException('Email already confirmed');

    user.isEmailConfirmed = true;
    await this.usersService.update(user);
  }

  async confirmEmailUpdate(token: string): Promise<void> {
    const payload = verifyTokenOrThrow(
      this.jwtService,
      token,
      JWT_PURPOSE.CONFIRM_EMAIL_UPDATE,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.email === payload.email)
      throw new BadRequestException('Email already changed');
    if (user.newEmail !== payload.email)
      throw new BadRequestException(
        'This confirmation link is no longer valid',
      );

    user.oldEmail = user.email;
    user.email = user.newEmail!;
    user.newEmail = null;
    user.emailChangedAt = new Date();
    await this.usersService.update(user);

    const revertToken = signToken(
      this.jwtService,
      { purpose: 'revert-email', sub: user.id, email: user.oldEmail },
      authConfig.jwt.emailConfirmationExpiresIn,
    );
    await sendRevertEmailChange(user.oldEmail, revertToken);
  }

  async revertEmail(token: string): Promise<string> {
    const payload = verifyTokenOrThrow(
      this.jwtService,
      token,
      JWT_PURPOSE.REVERT_EMAIL,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.email === payload.email)
      throw new BadRequestException('Email revert already done');
    if (user.oldEmail !== payload.email)
      throw new BadRequestException('This revert link is no longer valid');

    user.email = user.oldEmail!;
    user.oldEmail = null;
    user.emailChangedAt = null;
    await this.usersService.update(user);

    const resetToken = signToken(
      this.jwtService,
      {
        purpose: 'reset-password-after-revert',
        sub: user.id,
        email: user.email,
      },
      authConfig.jwt.resetPasswordExpiresIn,
    );
    return resetToken;
  }

  // Post
  async login(dto: LoginDto): Promise<string> {
    const user = await this.validateUserCredentials(dto);
    const accesToken = signToken(
      this.jwtService,
      { purpose: 'session', sub: user.id, email: user.email },
      authConfig.jwt.accessTokenExpiresIn,
    );
    return accesToken;
  }

  // Aux
  async validateUserCredentials(dto: LoginDto): Promise<User> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailConfirmed)
      throw new ForbiddenException('Email not confirmed');
    return user;
  }
}
