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

import { JWT_EXPIRES_IN } from 'src/common/constants/jwt-expires-in.constant';
import { JWT_PURPOSE } from 'src/common/constants/jwt-purpose.constant';
import { AppJwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { toSafeUser } from 'src/users/utils/to-safe-user';

import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { SafeUser } from './types/safe-user.type';

/**
 * UsersService
 *
 * Service responsible for managing user entities.
 * Handles user retrieval, profile updates, password changes,
 * email change requests, account locking, and user deletion.
 *
 * Exposes methods grouped by type:
 * - GET methods: Fetch user(s) by ID or email.
 * - SAVE methods: Persist new or updated user entities.
 * - PATCH methods: Update user-specific fields.
 * - DELETE methods: Remove user entities or clean up old unconfirmed accounts.
 * - AUXILIARY methods: Internal validation utilities (email uniqueness, password checks).
 *
 * This service is intended to be used by controllers handling user operations,
 * and by authentication flows needing direct access to user data.
 */

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: AppJwtService,
    private readonly mailService: MailService,
  ) {}

  // ===== GET METHODS =====

  public async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map(toSafeUser);
  }

  public findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  public async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  public async findMe(id: number): Promise<SafeUser> {
    const user = await this.findByIdOrThrow(id);
    return toSafeUser(user);
  }

  // ===== POST / SAVE METHODS =====

  public save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  // ===== PATCH METHODS =====

  public async updateProfile(id: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.findByIdOrThrow(id);

    if (dto.name === user.name)
      throw new BadRequestException(
        'New name must be different from the current one',
      );

    if (dto.name) user.name = dto.name;

    await this.save(user);
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
    await this.save(user);
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
    await this.save(user);

    const token = this.jwtService.sign(
      {
        purpose: JWT_PURPOSE.CONFIRM_EMAIL_UPDATE,
        sub: user.id,
        email: user.newEmail,
      },
      JWT_EXPIRES_IN.CONFIRM_EMAIL_UPDATE,
    );
    await this.mailService.sendConfirmationUpdatedEmail(user.newEmail, token);
  }

  public async lock(id: number): Promise<void> {
    const user = await this.findByIdOrThrow(id);
    user.isLocked = true;
    await this.save(user);
  }

  // ===== DELETE METHODS =====

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

  // ===== AUXILIARY METHODS =====

  public async ensureEmailIsAvailable(email: string): Promise<void> {
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
