import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokenEntity } from '../entities/user-token.entity';
import { Uuid } from '../../../core/value-objects/uuid';

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

  async saveToken(userUuid: Uuid, refreshToken): Promise<UserTokenEntity> {
    let tokenData = await this.tokenRepo.findOne({
      where: { userUuid },
    });
    if (!tokenData) {
      tokenData = new UserTokenEntity();
      tokenData.userUuid = userUuid;
    }
    tokenData.refreshToken = refreshToken;
    return this.tokenRepo.save(tokenData);
  }
}
