import { IsEmail, MaxLength } from 'class-validator';

export class UpdateUserEmailDto {
  @IsEmail({}, { message: 'Invalid email format' })
  public newEmail: string;

  @MaxLength(100)
  public password: string;
}
