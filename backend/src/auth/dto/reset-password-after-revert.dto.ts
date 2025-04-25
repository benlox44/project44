import { IsStrongPassword, MaxLength } from 'class-validator';

export class ResetPasswordAfterRevertDto {
  @MaxLength(100)
  @IsStrongPassword(
    {},
    {
      message:
        'New Password must be at least 8 characters and include ' +
        'uppercase, lowercase, number, and symbol',
    },
  )
  public newPassword: string;
}
