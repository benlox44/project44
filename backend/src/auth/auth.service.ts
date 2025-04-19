import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { SafeUser } from 'src/users/types/safe-user-type';
import { excludePassword } from 'src/utils/exclude-password';
import { signToken, verifyTokenOrThrow } from 'src/utils/jwt';
import { sendRevertEmailChange } from 'src/mail/mail.service';

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

    if (user.isEmailConfirmed) return { message: 'Email already confirmed' };

    user.isEmailConfirmed = true;
    await this.usersService.update(user);

    return { message: 'Email confirmed successfuly' };
  }

  async confirmEmailChange(token: string) {
    const payload = verifyTokenOrThrow(this.jwtService, token);

    const user = await this.usersService.findbyId(payload.sub);
    if (!user) throw new BadRequestException('User not found');

    if (user.email === payload.email) return { message: 'Email already changed' };
    if (user.newEmail !== payload.email)
      throw new BadRequestException('This confirmation link is no longer valid');

    user.oldEmail = user.email;
    user.email = user.newEmail!;
    user.newEmail = null;

    user.emailChangedAt = new Date();

    await this.usersService.update(user);

    const revertToken = signToken(this.jwtService, { sub: user.id, email: user.oldEmail }, '30d');
    await sendRevertEmailChange(user.oldEmail, revertToken);

    return { message: 'Email changed successfully' };
  }

  async revertEmailChange(token: string) {
    const payload = verifyTokenOrThrow(this.jwtService, token);

    const user = await this.usersService.findbyId(payload.sub);
    if (!user) throw new BadRequestException('User not found');

    if (user.email === payload.email) return { message: 'Revert already done' };
    if (user.oldEmail !== payload.email)
      throw new BadRequestException('This revert link is no longer valid');

    user.email = user.oldEmail!;
    user.oldEmail = null;
    user.emailChangedAt = null;

    await this.usersService.update(user);
    return { message: 'Email change reverted successfully' };
  }

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    if (!user.isEmailConfirmed) throw new ForbiddenException('Email not confirmed');

    return excludePassword(user);
  }

  login(user: SafeUser) {
    const acces_token = signToken(this.jwtService, { sub: user.id, email: user.email }, '7d');
    return { acces_token: acces_token };
  }
}
