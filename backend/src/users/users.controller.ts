import { Controller, ParseIntPipe, Body, Post, Patch, Get, Delete, Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { SafeUser } from './types/safe-user-type';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<{ message: string }> {
    return this.usersService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto): Promise<SafeUser> {
    return this.usersService.editProfile(user.sub, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/email')
  async requestEmailChange(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserEmailDto,
  ): Promise<{ message: string }> {
    return this.usersService.requestEmailChange(user.sub, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteMe(@CurrentUser() user: JwtPayload): Promise<{ message: string }> {
    await this.usersService.delete(user.sub);
    return { message: 'Your account was deleted successfully' };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
