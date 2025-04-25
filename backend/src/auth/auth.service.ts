import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { JWT_EXPIRES_IN } from 'src/common/constants/jwt-expires-in.constant';
import { JWT_PURPOSE } from 'src/common/constants/jwt-purpose.constant';
import { LOGIN_BLOCK } from 'src/common/constants/login-block.constant';
import { AppJwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { UsersRedisService } from 'src/redis/services/users-redis.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestConfirmationEmail } from './dto/request-confirmation-email.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { RequestUnlockDto } from './dto/request-unlock.dto';
import { ResetPasswordAfterRevertDto } from './dto/reset-password-after-revert.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: AppJwtService,
    private readonly mailService: MailService,
    private readonly usersRedisService: UsersRedisService,
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
    await this.usersService.save(user);
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
    await this.usersService.save(user);

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

    await this.usersService.save(user);
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

  public async unlockAccount(token: string): Promise<void> {
    const payload = await this.jwtService.verify(
      token,
      JWT_PURPOSE.UNLOCK_ACCOUNT,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (!user.isLocked) {
      throw new BadRequestException('Account is already unlocked');
    }

    user.isLocked = false;
    await this.usersService.save(user);

    await this.jwtService.markAsUsed(
      payload.jti,
      JWT_EXPIRES_IN.UNLOCK_ACCOUNT,
    );
  }

  // Post
  public async create(dto: CreateUserDto): Promise<void> {
    await this.usersService.ensureEmailIsAvailable(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.save({
      ...dto,
      password: hashedPassword,
    } as User);

    const token = this.jwtService.sign(
      { purpose: JWT_PURPOSE.CONFIRM_EMAIL, sub: user.id, email: user.email },
      JWT_EXPIRES_IN.CONFIRM_EMAIL,
    );
    await this.mailService.sendConfirmationEmail(user.email, token);
  }

  public async login(dto: LoginDto): Promise<string> {
    const user = await this.validateUserCredentials(dto);
    const accesToken = this.jwtService.sign(
      { purpose: JWT_PURPOSE.SESSION, sub: user.id, email: user.email },
      JWT_EXPIRES_IN.SESSION,
    );
    return accesToken;
  }

  public async requestConfirmationEmail(
    dto: RequestConfirmationEmail,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.isEmailConfirmed) return;

    const token = this.jwtService.sign(
      { purpose: JWT_PURPOSE.CONFIRM_EMAIL, sub: user.id, email: user.email },
      JWT_EXPIRES_IN.CONFIRM_EMAIL,
    );
    await this.mailService.sendConfirmationEmail(user.email, token);
  }

  public async requestPasswordReset(
    dto: RequestPasswordResetDto,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isEmailConfirmed) return;

    const token = this.jwtService.sign(
      {
        purpose: JWT_PURPOSE.RESET_PASSWORD,
        sub: user.id,
        email: user.email,
      },
      JWT_EXPIRES_IN.RESET_PASSWORD,
    );
    await this.mailService.sendPasswordReset(user.email, token);
  }

  public async resetPasswordAfterRevert(
    token: string,
    dto: ResetPasswordAfterRevertDto,
  ): Promise<void> {
    const payload = await this.jwtService.verify(
      token,
      JWT_PURPOSE.RESET_PASSWORD_AFTER_REVERT,
    );
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    const match = await bcrypt.compare(dto.newPassword, user.password);
    if (match)
      throw new ConflictException(
        'New password must be different from the current one',
      );

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.save(user);
    await this.jwtService.markAsUsed(
      payload.jti,
      JWT_EXPIRES_IN.RESET_PASSWORD,
    );
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
    await this.usersService.save(user);
    await this.jwtService.markAsUsed(
      payload.jti,
      JWT_EXPIRES_IN.RESET_PASSWORD,
    );
  }

  public async requestUnlock(dto: RequestUnlockDto): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isLocked) return;

    const token = this.jwtService.sign(
      {
        purpose: JWT_PURPOSE.UNLOCK_ACCOUNT,
        sub: user.id,
        email: user.email,
      },
      JWT_EXPIRES_IN.UNLOCK_ACCOUNT,
    );
    await this.mailService.sendUnlockAccount(user.email, token);
  }

  // Aux
  private async validateUserCredentials(dto: LoginDto): Promise<User> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.isLocked) throw new ForbiddenException('Account is locked');

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) {
      const failures = await this.usersRedisService.incrementFailures(
        user.email,
      );

      if (failures >= LOGIN_BLOCK.MAX_FAILURES) {
        await this.usersService.lock(user.id);

        const token = this.jwtService.sign(
          {
            purpose: JWT_PURPOSE.UNLOCK_ACCOUNT,
            sub: user.id,
            email: user.email,
          },
          JWT_EXPIRES_IN.UNLOCK_ACCOUNT,
        );
        await this.mailService.sendUnlockAccount(user.email, token);

        throw new ForbiddenException(
          'Account has been locked due to failed attempts',
        );
      }
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.usersRedisService.resetFailures(user.email);

    if (!user.isEmailConfirmed)
      throw new ForbiddenException('Email not confirmed');
    return user;
  }
}
