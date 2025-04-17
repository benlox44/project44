import { Controller, Post, Get, Body, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) throw new UnauthorizedException();
        return this.authService.login(user);
    }

    @Get('confirm')
    async confirmEmail(@Query('token') token: string) {
        if (!token) throw new BadRequestException('Token is required');
        return this.authService.confirmEmail(token);
    }
}
