import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, LessThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SafeUser } from './types/safe-user-type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { sendEmailConfirmation, sendNewEmailConfirmation } from 'src/mail/mail.service';
import { excludePassword } from 'src/utils/exclude-password';
import { signToken } from 'src/utils/jwt';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.find();
    return users.map(excludePassword);
  }

  async findbyId(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(data: CreateUserDto): Promise<{ message: string }> {
    const existing = await this.usersRepository.findOneBy({ email: data.email });
    if (existing) throw new ConflictException('Email is already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);

    const token = signToken(this.jwtService, { sub: user.id, email: user.email });
    await sendEmailConfirmation(saved.email, token);

    return { message: 'Confirmation email sent to ' + saved.email };
  }

  async update(user: User): Promise<void> {
    await this.usersRepository.save(user);
  }

  async editProfile(id: number, dto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (dto.name === user.name)
      throw new BadRequestException('The new name must be different from the current one');

    if (dto.name) user.name = dto.name;

    const updated = await this.usersRepository.save(user);
    return excludePassword(updated);
  }

  async requestEmailChange(id: number, dto: UpdateUserEmailDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new ForbiddenException('Incorrect password');

    const existing = await this.usersRepository.findOneBy({ email: dto.newEmail });
    if (existing) throw new ConflictException('Email already in use');

    if (
      user.emailChangedAt &&
      new Date().getTime() - user.emailChangedAt.getTime() < 2_592_000_000
    ) {
      throw new ConflictException('You can only change your email once every 30 days');
    }

    user.newEmail = dto.newEmail;
    await this.usersRepository.save(user);

    const token = signToken(this.jwtService, { sub: user.id, email: user.newEmail });
    await sendNewEmailConfirmation(dto.newEmail, token);

    return { message: 'Confirmation email sent to ' + dto.newEmail };
  }

  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User with ID ${id} not found`);
  }

  async deleteUnconfirmedOlderThan(date: Date): Promise<DeleteResult> {
    return await this.usersRepository.delete({
      isEmailConfirmed: false,
      createdAt: LessThan(date),
    });
  }
}
