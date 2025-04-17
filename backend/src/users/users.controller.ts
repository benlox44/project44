import { Controller, ParseIntPipe, Body, Post, Patch, Get, Delete, Param } from '@nestjs/common';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/auth/types/auth-request.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { SafeUser } from './types/safe-user-type';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<SafeUser> {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async update(
        @Req() req: AuthRequest,
        @Body() dto: UpdateUserDto
    ): Promise<SafeUser> {
        return this.usersService.edit(req.user.sub, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me/email')
    async requestEmailChange(
        @Req() req: AuthRequest,
        @Body() dto: UpdateEmailDto,
    ) {
        return this.usersService.requestEmailChange(req.user.sub, dto.newEmail)
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
