import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/jwt/types/jwt-payload.type';

import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordAfterRevertDto } from './dto/reset-password-after-revert.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SafeUser } from './types/safe-user.type';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  public async findAll(): Promise<{ data: SafeUser[] }> {
    const data = await this.usersService.findAll();
    return { data };
  }

  @Post()
  public async create(
    @Body() dto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.create(dto);
    return { message: 'Confirmation email sent to ' + dto.email };
  }

  @Post('reset-password-after-revert')
  public async resetPasswordAfterRevert(
    @Query('token') token: string,
    @Body() dto: ResetPasswordAfterRevertDto,
  ): Promise<{ message: string }> {
    await this.usersService.resetPasswordAfterRevert(token, dto);
    return { message: 'Password changed successfully' };
  }

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

  @Delete(':id')
  public async deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
