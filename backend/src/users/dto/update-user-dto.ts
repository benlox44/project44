import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^(?!.*\s{2,})(?!^\s)(?!.*\s$).*$/, {
    message: 'Name must not have leading, trailing, or multiple spaces',
  })
  name: string;
}
