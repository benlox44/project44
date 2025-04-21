import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { DeleteResult, LessThan, Repository } from 'typeorm';

import {
  sendConfirmationEmail,
  sendConfirmationUpdatedEmail,
} from 'src/common/mail/mail.service';
import { JWT_EXPIRES_IN } from 'src/jwt/constants/jwt-expires-in.constant';
import { JWT_PURPOSE } from 'src/jwt/constants/jwt-purpose.constant';
import { AppJwtService } from 'src/jwt/jwt.service';
import { toSafeUser } from 'src/users/utils/to-safe-user';

import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordAfterRevertDto } from './dto/reset-password-after-revert.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { SafeUser } from './types/safe-user.type';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: AppJwtService,
  ) {}

  // Get
  public async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map(toSafeUser);
  }

  public async findbyId(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  public async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.findbyId(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  // Post
  public async create(dto: CreateUserDto): Promise<void> {
    await this.ensureEmailIsAvailable(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign(
      { purpose: JWT_PURPOSE.CONFIRM_EMAIL, sub: user.id, email: user.email },
      JWT_EXPIRES_IN.CONFIRM_EMAIL,
    );
    await sendConfirmationEmail(user.email, token);
  }

  public async resetPasswordAfterRevert(
    token: string,
    dto: ResetPasswordAfterRevertDto,
  ): Promise<void> {
    const payload = this.jwtService.verify(
      token,
      JWT_PURPOSE.RESET_PASSWORD_AFTER_REVERT,
    );
    const user = await this.findByIdOrThrow(payload.sub);

    const match = await bcrypt.compare(dto.newPassword, user.password);
    if (match)
      throw new ConflictException(
        'New password must be different from the current one',
      );

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);
  }

  // Patch
  public async update(user: User): Promise<void> {
    await this.usersRepository.save(user);
  }

  public async updateProfile(id: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    if (dto.name === user.name)
      throw new BadRequestException(
        'New name must be different from the current one',
      );

    if (dto.name) user.name = dto.name;

    await this.usersRepository.save(user);
  }

  public async updatePassword(
    id: number,
    dto: UpdateUserPasswordDto,
  ): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    await this.ensurePasswordIsValid(dto.currentPassword, user.password);

    const match = await bcrypt.compare(dto.newPassword, user.password);
    if (match)
      throw new ConflictException(
        'New password must be different from the current one',
      );

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);
  }

  public async requestEmailUpdate(
    id: number,
    dto: UpdateUserEmailDto,
  ): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    await this.ensurePasswordIsValid(dto.password, user.password);
    await this.ensureEmailIsAvailable(dto.newEmail);

    if (
      user.emailChangedAt &&
      new Date().getTime() - user.emailChangedAt.getTime() < 2_592_000_000
    ) {
      throw new ConflictException(
        'You can only change your email once every 30 days',
      );
    }

    if (dto.newEmail === user.email)
      throw new ConflictException(
        'New email must be different from the current one',
      );

    user.newEmail = dto.newEmail;
    await this.usersRepository.save(user);

    const token = this.jwtService.sign(
      {
        purpose: JWT_PURPOSE.CONFIRM_EMAIL_UPDATE,
        sub: user.id,
        email: user.newEmail,
      },
      JWT_EXPIRES_IN.CONFIRM_EMAIL_UPDATE,
    );
    await sendConfirmationUpdatedEmail(user.newEmail, token);
  }

  // Delete
  public async delete(id: number): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.usersRepository.delete(id);
  }

  public async deleteUnconfirmedOlderThan(date: Date): Promise<DeleteResult> {
    return await this.usersRepository.delete({
      isEmailConfirmed: false,
      createdAt: LessThan(date),
    });
  }

  // Aux
  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (user) throw new ConflictException('Email is already registered');
  }

  private async ensurePasswordIsValid(
    plain: string,
    hashed: string,
  ): Promise<void> {
    const match = await bcrypt.compare(plain, hashed);
    if (!match) throw new ForbiddenException('Incorrect password');
  }
}
