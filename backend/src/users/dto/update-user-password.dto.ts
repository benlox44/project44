import { IsEmail, MinLength, Matches } from 'class-validator';

export class UpdateUserPasswordDto {
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
