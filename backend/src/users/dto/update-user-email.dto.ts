import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserEmailDto {
  @IsEmail()
  newEmail: string;

  @IsNotEmpty()
  password: string;
}
