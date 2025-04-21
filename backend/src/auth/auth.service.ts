import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { sendRevertEmailChange } from 'src/common/mail/mail.service';
import { JWT_EXPIRES_IN } from 'src/jwt/constants/jwt-expires-in.constant';
import { JWT_PURPOSE } from 'src/jwt/constants/jwt-purpose.constant';
import { AppJwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  public constructor(
    private usersService: UsersService,
    private jwtService: AppJwtService,
  ) {}

  // Get
  public async confirmEmail(token: string): Promise<void> {
    const payload = this.jwtService.verify(token, JWT_PURPOSE.CONFIRM_EMAIL);
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.isEmailConfirmed)
      throw new BadRequestException('Email already confirmed');

    user.isEmailConfirmed = true;
    await this.usersService.update(user);
  }

  public async confirmEmailUpdate(token: string): Promise<void> {
    const payload = this.jwtService.verify(
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

    const revertToken = this.jwtService.sign(
      { purpose: JWT_PURPOSE.REVERT_EMAIL, sub: user.id, email: user.oldEmail },
      JWT_EXPIRES_IN.REVERT_EMAIL,
    );
    await sendRevertEmailChange(user.oldEmail, revertToken);
  }

  public async revertEmail(token: string): Promise<string> {
    const payload = this.jwtService.verify(token, JWT_PURPOSE.REVERT_EMAIL);
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.email === payload.email)
      throw new BadRequestException('Email revert already done');
    if (user.oldEmail !== payload.email)
      throw new BadRequestException('This revert link is no longer valid');

    user.email = user.oldEmail!;
    user.oldEmail = null;
    user.emailChangedAt = null;
    await this.usersService.update(user);

    const resetToken = this.jwtService.sign(
      {
        purpose: JWT_PURPOSE.RESET_PASSWORD_AFTER_REVERT,
        sub: user.id,
        email: user.email,
      },
      JWT_EXPIRES_IN.RESET_PASSWORD_AFTER_REVERT,
    );
    return resetToken;
  }

  // Post
  public async login(dto: LoginDto): Promise<string> {
    const user = await this.validateUserCredentials(dto);
    const accesToken = this.jwtService.sign(
      { purpose: JWT_PURPOSE.SESSION, sub: user.id, email: user.email },
      JWT_EXPIRES_IN.SESSION,
    );
    return accesToken;
  }

  // Aux
  private async validateUserCredentials(dto: LoginDto): Promise<User> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailConfirmed)
      throw new ForbiddenException('Email not confirmed');
    return user;
  }
}
