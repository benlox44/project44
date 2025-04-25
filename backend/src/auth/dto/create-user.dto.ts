import {
  IsEmail,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^(?!.*\s{2,})(?!^\s)(?!.*\s$).*$/, {
    message: 'Name must not have leading, trailing, or multiple spaces',
  })
  public name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  public email: string;

  @MaxLength(100)
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters and include ' +
        'uppercase, lowercase, number, and symbol',
    },
  )
  public password: string;
}
