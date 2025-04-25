import { MaxLength } from 'class-validator';

export class RequestUnlockDto {
  @MaxLength(100)
  public email: string;
}
