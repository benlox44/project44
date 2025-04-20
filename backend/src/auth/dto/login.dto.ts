import { MaxLength } from 'class-validator';

export class LoginDto {
  @MaxLength(100)
  email: string;

  @MaxLength(100)
  password: string;
}
