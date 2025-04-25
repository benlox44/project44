import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestConfirmationEmailDto } from './dto/request-confirmation-email.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { RequestUnlockDto } from './dto/request-unlock.dto';
import { ResetPasswordAfterRevertDto } from './dto/reset-password-after-revert.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

/**
 * AuthController
 *
 * Controller responsible for handling authentication and authorization flows.
 *
 * Exposes endpoints separated by HTTP method:
 * - GET METHODS: Confirm email, revert email, unlock account using tokens.
 * - POST METHODS: Register, login, request password reset, reset password, request unlock.
 *
 * Routes manage user sessions and account recovery processes.
 */
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  // ===== GET METHODS =====

  @Get('confirm-email')
  public async confirmEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.confirmEmail(token);
    return { message: 'Email confirmed successfuly' };
  }

  @Get('confirm-email-update')
  public async confirmEmailUpdate(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.confirmEmailUpdate(token);
    return { message: 'Email changed successfully' };
  }

  @Get('revert-email')
  public async revertEmail(
    @Query('token') token: string,
  ): Promise<{ reset_token: string }> {
    const reset_token = await this.authService.revertEmail(token);
    return { reset_token };
  }

  @Get('unlock-account')
  public async unlockAccount(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.unlockAccount(token);
    return { message: 'Your account has been unlocked. You can now log in' };
  }

  // ===== POST METHODS =====

  @Post()
  public async create(
    @Body() dto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.create(dto);
    return { message: 'Confirmation email sent to ' + dto.email };
  }

  @Post('login')
  public async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    const access_token = await this.authService.login(dto);
    return { access_token };
  }

  @Post('request-confirmation-email')
  public async requestConfirmationEmail(
    @Body() dto: RequestConfirmationEmailDto,
  ): Promise<{ message: string }> {
    await this.authService.requestConfirmationEmail(dto);
    return {
      message: 'If your email is registered and not confirmed, a link was sent',
    };
  }

  @Post('request-password-reset')
  public async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<{ message: string }> {
    await this.authService.requestPasswordReset(dto);
    return {
      message: 'If your email is registered and is confirmed, a link was sent',
    };
  }

  @Post('reset-password')
  public async resetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, dto);
    return { message: 'Password changed successfully' };
  }

  @Post('reset-password-after-revert')
  public async resetPasswordAfterRevert(
    @Query('token') token: string,
    @Body() dto: ResetPasswordAfterRevertDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPasswordAfterRevert(token, dto);
    return { message: 'Password changed successfully' };
  }

  @Post('request-unlock')
  public async requestUnlock(
    @Body() dto: RequestUnlockDto,
  ): Promise<{ message: string }> {
    await this.authService.requestUnlock(dto);
    return {
      message: 'If your email is registered and is locked, a link was sent',
    };
  }
}
