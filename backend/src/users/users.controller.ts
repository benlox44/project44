import {
  Controller,
  ParseIntPipe,
  Body,
  Post,
  Patch,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SafeUser } from './types/safe-user.type';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<{ message: string }> {
    await this.usersService.create(dto);
    return { message: 'Confirmation email sent to ' + dto.email };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateProfile(user.sub, dto);
    return { message: 'Profile updated successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/password')
  async updatePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.updatePassword(user.sub, dto);
    return { message: 'Password updated successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/email')
  async requestUpdateEmail(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserEmailDto,
  ): Promise<{ message: string }> {
    await this.usersService.requestEmailUpdate(user.sub, dto);
    return { message: 'Confirmation email sent to ' + dto.newEmail };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteMe(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.usersService.delete(user.sub);
    return { message: 'Your account was deleted successfully' };
  }

  @Delete(':id')
  async deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
