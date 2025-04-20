import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('confirm-email')
  async confirmEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.confirmEmail(token);
    return { message: 'Email confirmed successfuly' };
  }

  @Get('confirm-email-change')
  async confirmEmailChange(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.confirmEmailChange(token);
    return { message: 'Email changed successfully' };
  }

  @Get('revert-email')
  async revertEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.revertEmail(token);
    return { message: 'Email reverted successfully' };
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ acces_token: string }> {
    return this.authService.login(dto);
  }
}
