import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ActivateDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsNumber()
  code: number;
}
