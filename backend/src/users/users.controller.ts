import { Controller, ParseIntPipe, Body, Post, Patch, Get, Delete, Param } from '@nestjs/common';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/auth/types/auth-request.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { SafeUser } from './types/safe-user-type';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

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
  async update(@Req() req: AuthRequest, @Body() dto: UpdateUserDto): Promise<SafeUser> {
    return this.usersService.editProfile(req.user.sub, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/email')
  async requestEmailChange(
    @Req() req: AuthRequest,
    @Body() dto: UpdateUserEmailDto,
  ): Promise<{ message: string }> {
    return this.usersService.requestEmailChange(req.user.sub, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteMe(@Req() req: AuthRequest): Promise<{ message: string }> {
    await this.usersService.delete(req.user.sub);
    return { message: 'Your account was deleted successfully' };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
