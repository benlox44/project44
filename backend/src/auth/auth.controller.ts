import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

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

  @Post('login')
  public async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    const access_token = await this.authService.login(dto);
    return { access_token };
  }

  @Post('reset-password')
  public async resetPassword(
    @Query('token') token: string,
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, dto);
    return { message: 'Password changed successfully' };
  }
}
