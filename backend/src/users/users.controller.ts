import { Controller, ParseIntPipe, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { SafeUser } from './types/safe-user-type';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<SafeUser> {
        return this.usersService.create(createUserDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.usersService.remove(id);
        return { message: `User with ID ${id} deleted successfully` }
    }

    @Get()
    findAll(): Promise<SafeUser[]> {
        return this.usersService.findAll();
    }
}
