import { MaxLength } from 'class-validator';

export class RequestConfirmationEmail {
  @MaxLength(100)
  public email: string;
}
