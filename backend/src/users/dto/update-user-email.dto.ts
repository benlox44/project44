import { IsEmail, MaxLength } from 'class-validator';

export class UpdateUserEmailDto {
  @IsEmail({}, { message: 'Invalid email format' })
  newEmail: string;

  @MaxLength(100)
  password: string;
}
