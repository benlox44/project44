import { Controller, Post, Get, Body, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('confirm')
    async confirmEmail(@Query('token') token: string) {
        if (!token) throw new BadRequestException('Token is required');
        return this.authService.confirmEmail(token);
    }

    @Get('confirm-email-change')
    async confirmEmailChange(@Query('token') token: string) {
        return this.authService.confirmEmailChange(token);
    }

    @Get('revert-email-change')
    async revertEmailChange(@Query('token') token: string) {
        return this.authService.revertEmailChange(token);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        if (!user) throw new UnauthorizedException();
        return this.authService.login(user);
    }
}
