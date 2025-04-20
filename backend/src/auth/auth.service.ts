import {
  BadRequestException,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { authConfig } from 'src/common/config/auth.config';
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
    const payload = verifyTokenOrThrow(this.jwtService, token);
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.isEmailConfirmed)
      throw new BadRequestException('Email already confirmed');

    user.isEmailConfirmed = true;
    await this.usersService.update(user);
  }

  async confirmEmailChange(token: string): Promise<void> {
    const payload = verifyTokenOrThrow(this.jwtService, token);
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
      { sub: user.id, email: user.oldEmail },
      authConfig.jwt.emailConfirmationExpiresIn,
    );

    await sendRevertEmailChange(user.oldEmail, revertToken);
  }

  async revertEmail(token: string): Promise<void> {
    const payload = verifyTokenOrThrow(this.jwtService, token);
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.email === payload.email)
      throw new BadRequestException('Email revert already done');
    if (user.oldEmail !== payload.email)
      throw new BadRequestException('This revert link is no longer valid');

    user.email = user.oldEmail!;
    user.oldEmail = null;
    user.emailChangedAt = null;

    await this.usersService.update(user);
  }

  // Post
  async login(dto: LoginDto): Promise<{ acces_token: string }> {
    const user = await this.validateUserCredentials(dto);
    const acces_token = signToken(
      this.jwtService,
      { sub: user.id, email: user.email },
      authConfig.jwt.accessTokenExpiresIn,
    );
    return { acces_token: acces_token };
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
