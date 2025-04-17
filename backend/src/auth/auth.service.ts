import { BadRequestException, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { SafeUser } from 'src/users/types/safe-user-type';
import { excludePassword } from 'src/utils/exclude-password';
import { verifyTokenOrThrow } from 'src/utils/verify-token';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async confirmEmail(token: string) {
        const payload = verifyTokenOrThrow(this.jwtService, token);

        const user = await this.usersService.findbyId(payload.sub);
        if (!user) throw new BadRequestException('User not found');
            
        if (user.emailConfirmed) return { message: 'Email already confirmed' };

        user.emailConfirmed = true;
        await this.usersService.update(user);

        return { message: 'Email confirmed successfuly' };
    }

    async confirmEmailChange(token: string) {
        const payload = verifyTokenOrThrow(this.jwtService, token);

        const user = await this.usersService.findbyId(payload.sub);
        if (!user) throw new BadRequestException('User not found');

        if (user.newEmail !== payload.newEmail) throw new BadRequestException('This confirmation link is no longer valid')

        user.email = user.newEmail!;
        user.newEmail = null;
        await this.usersService.update(user);
      
        return { message: 'Email changed successfully' };
    }

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
}
