import { MaxLength } from 'class-validator';

export class LoginDto {
  @MaxLength(100)
  public email: string;

  @MaxLength(100)
  public password: string;
}
