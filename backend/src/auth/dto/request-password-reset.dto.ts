import { MaxLength } from 'class-validator';

export class RequestPasswordResetDto {
  @MaxLength(100)
  public email: string;
}
