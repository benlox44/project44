import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from 'src/jwt/decorators/current-user.decorator';
import { JwtPayload } from 'src/jwt/types/jwt-payload.type';

import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SafeUser } from './types/safe-user.type';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  // Admin
  @Get()
  public async findAll(): Promise<{ data: SafeUser[] }> {
    const data = await this.usersService.findAll();
    return { data };
  }

  @Delete(':id')
  public async deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }

  // User
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  public async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateProfile(user.sub, dto);
    return { message: 'Profile updated successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/password')
  public async updatePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.updatePassword(user.sub, dto);
    return { message: 'Password updated successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/email')
  public async requestUpdateEmail(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserEmailDto,
  ): Promise<{ message: string }> {
    await this.usersService.requestEmailUpdate(user.sub, dto);
    return { message: 'Confirmation email sent to ' + dto.newEmail };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  public async deleteMe(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.usersService.delete(user.sub);
    return { message: 'Your account was deleted successfully' };
  }
}
