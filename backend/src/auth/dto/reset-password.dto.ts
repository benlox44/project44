import { IsStrongPassword, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @MaxLength(100)
  @IsStrongPassword(
    {},
    {
      message:
        'New password must be at least 8 characters and include ' +
        'uppercase, lowercase, number, and symbol',
    },
  )
  public newPassword: string;
}
