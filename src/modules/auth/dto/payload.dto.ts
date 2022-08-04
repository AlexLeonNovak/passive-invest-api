// import { UserEntity } from '../../../common/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PayloadDto {
  @ApiProperty()
  public user: object;

  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
}
