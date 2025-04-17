import { BadRequestException, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { SafeUser } from 'src/users/types/safe-user-type';
import { excludePassword } from 'src/utils/exclude-password';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<SafeUser | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        if (!user.emailConfirmed) throw new ForbiddenException('Email not confirmed');

        return excludePassword(user);
    }

    async login(user: SafeUser) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        }
    };

    async confirmEmail(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findByEmail(payload.email);

            if (!user) throw new BadRequestException('Invalid token');
            if (user.emailConfirmed) return { message: 'Email already confirmed' };

            user.emailConfirmed = true;
            await this.usersService.save(user);

            return { message: 'Email confirmed successfuly' };
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }
}
