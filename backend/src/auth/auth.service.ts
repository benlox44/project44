import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { JWT_EXPIRES_IN } from 'src/jwt/constants/jwt-expires-in.constant';
import { JWT_PURPOSE } from 'src/jwt/constants/jwt-purpose.constant';
import { AppJwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: AppJwtService,
    private readonly mailService: MailService,
  ) {}

  // Get
  public async confirmEmail(token: string): Promise<void> {
    const payload = await this.jwtService.verify(
      token,
      JWT_PURPOSE.CONFIRM_EMAIL,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.isEmailConfirmed)
      throw new BadRequestException('Email Already confirmed');

    user.isEmailConfirmed = true;
    await this.usersService.update(user);
    await this.jwtService.markAsUsed(payload.jti, JWT_EXPIRES_IN.CONFIRM_EMAIL);
  }

  public async confirmEmailUpdate(token: string): Promise<void> {
    const payload = await this.jwtService.verify(
      token,
      JWT_PURPOSE.CONFIRM_EMAIL_UPDATE,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

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
    await this.mailService.sendRevertEmailChange(user.oldEmail, revertToken);
    await this.jwtService.markAsUsed(
      payload.jti,
      JWT_EXPIRES_IN.CONFIRM_EMAIL_UPDATE,
    );
  }

  public async revertEmail(token: string): Promise<string> {
    const payload = await this.jwtService.verify(
      token,
      JWT_PURPOSE.REVERT_EMAIL,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    /** Token expires in 30d, and change is allowed only once per 30d
    no extra checks needed */
    user.email = user.oldEmail!;
    user.oldEmail = null;
    user.emailChangedAt = null;

    await this.usersService.update(user);
    await this.jwtService.markAsUsed(payload.jti, JWT_EXPIRES_IN.REVERT_EMAIL);

    return this.jwtService.sign(
      {
        purpose: JWT_PURPOSE.RESET_PASSWORD_AFTER_REVERT,
        sub: user.id,
        email: user.email,
      },
      JWT_EXPIRES_IN.RESET_PASSWORD,
    );
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

  public async resetPassword(
    token: string,
    dto: ResetPasswordDto,
  ): Promise<void> {
    const payload = await this.jwtService.verify(
      token,
      JWT_PURPOSE.RESET_PASSWORD,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    const match = await bcrypt.compare(dto.newPassword, user.password);
    if (match)
      throw new ConflictException(
        'New password must be different from the current one',
      );

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.update(user);
    await this.jwtService.markAsUsed(
      payload.jti,
      JWT_EXPIRES_IN.RESET_PASSWORD,
    );
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
