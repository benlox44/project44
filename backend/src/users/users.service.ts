import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { SafeUser } from './types/safe-user-type';
import { CreateUserDto } from './dto/create-user.dto';
import { sendConfirmationEmail } from 'src/mail/mail.service';
import { excludePassword } from 'src/utils/exclude-password';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async create(data: CreateUserDto): Promise<SafeUser> {
        const existing = await this.usersRepository.findOneBy({email: data.email});
        if (existing) throw new ConflictException('Email is already registered');
        
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = this.usersRepository.create({
            ... data,
            password: hashedPassword,
        });
         
        const saved = await this.usersRepository.save(user);

        const token = this.jwtService.sign(
            { email: saved.email },
            { expiresIn: '1h' }
        );
        await sendConfirmationEmail(saved.email, token);

        return excludePassword(user);
    }

    async update(user: User): Promise<void> {
        await this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`User with ID ${id} not found`);
    }      

    async findAll(): Promise<SafeUser[]> {
        const users = await this.usersRepository.find();
        return users.map(({ password, ...safeUser }) => safeUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }
}
