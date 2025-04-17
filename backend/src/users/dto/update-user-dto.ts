import { IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/, {
    message: 'Name must include at least a first and last name',
  })
  name?: string;
}
