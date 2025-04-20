import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { authConfig } from 'src/common/config/auth.config';
import {
  sendConfirmationEmail,
  sendConfirmationUpdatedEmail,
} from 'src/common/mail/mail.service';
import { signToken } from 'src/common/utils/jwt';
import { toSafeUser } from 'src/common/utils/to-safe-user';
import { DeleteResult, LessThan, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { SafeUser } from './types/safe-user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Get
  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map(toSafeUser);
  }

  async findbyId(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.findbyId(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  // Post
  async create(dto: CreateUserDto): Promise<void> {
    await this.ensureEmailIsAvailable(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    const token = signToken(
      this.jwtService,
      { sub: user.id, email: user.email },
      authConfig.jwt.emailConfirmationExpiresIn,
    );

    await sendConfirmationEmail(user.email, token);
  }

  // Patch
  async update(user: User): Promise<void> {
    await this.usersRepository.save(user);
  }

  async updateProfile(id: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    if (dto.name === user.name)
      throw new BadRequestException(
        'The new name must be different from the current one',
      );

    if (dto.name) user.name = dto.name;

    await this.usersRepository.save(user);
  }

  async updatePassword(id: number, dto: UpdateUserPasswordDto): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    await this.ensurePasswordIsValid(dto.currentPassword, user.password);

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);
  }

  async requestEmailUpdate(id: number, dto: UpdateUserEmailDto): Promise<void> {
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

    user.newEmail = dto.newEmail;
    await this.usersRepository.save(user);

    const token = signToken(
      this.jwtService,
      { sub: user.id, email: user.newEmail },
      authConfig.jwt.emailConfirmationExpiresIn,
    );
    await sendConfirmationUpdatedEmail(user.newEmail, token);
  }

  // Delete
  async delete(id: number): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.usersRepository.delete(id);
  }

  async deleteUnconfirmedOlderThan(date: Date): Promise<DeleteResult> {
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
