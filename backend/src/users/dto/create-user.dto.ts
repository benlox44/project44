import { IsEmail, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/, {
    message: 'Full name must include at least a first and last name',
  })
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
