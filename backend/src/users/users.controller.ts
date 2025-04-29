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

/**
 * UsersController
 *
 * Controller responsible for managing user-related endpoints.
 *
 * Exposes actions separated by role:
 * - ADMIN ACTIONS: Retrieve or delete any user.
 * - USER ACTIONS (ME): Update or delete own profile and credentials.
 *
 * Routes are protected by JWT authentication where necessary.
 */
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  // ===== ADMIN ACTIONS =====

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

  // ===== USER ACTIONS (ME) =====

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  public async findProfile(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ data: SafeUser }> {
    const data = await this.usersService.findMe(user.sub);
    return { data };
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
}
