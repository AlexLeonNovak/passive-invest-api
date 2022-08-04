import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class JoinByEmailDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail({}, { message: 'Email is not valid' })
  public readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[a-zA-Z]+/, {
    message: 'Password must include at least one letter',
  })
  @Matches(/\d+/, {
    message: 'Password must include at least one number',
  })
  public readonly password: string;
}
