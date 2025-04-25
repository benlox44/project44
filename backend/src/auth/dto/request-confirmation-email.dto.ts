import { MaxLength } from 'class-validator';

export class RequestConfirmationEmailDto {
  @MaxLength(100)
  public email: string;
}
