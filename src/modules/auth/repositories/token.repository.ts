import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokenEntity } from '../entities/user-token.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(UserTokenEntity)
    private tokenRepo: Repository<UserTokenEntity>,
  ) {}

  async removeToken(refreshToken: string): Promise<void> {
    await this.tokenRepo.delete({ refreshToken });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserTokenEntity> {
    return await this.tokenRepo.findOne({
      where: { refreshToken },
      relations: { user: true },
    });
  }

  async saveToken(user: UserEntity, refreshToken): Promise<UserTokenEntity> {
    let tokenData = await this.tokenRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (!tokenData) {
      tokenData = new UserTokenEntity();
      tokenData.user = user;
    }
    tokenData.refreshToken = refreshToken;
    return this.tokenRepo.save(tokenData);
  }
}
