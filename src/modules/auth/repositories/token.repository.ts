import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokenEntity } from '../entities/user-token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(UserTokenEntity)
    private tokenRepo: Repository<UserTokenEntity>,
  ) {}

  async remove(refreshToken: string): Promise<void> {
    await this.tokenRepo.delete({ refreshToken });
  }

  async findOne(refreshToken: string): Promise<UserTokenEntity> {
    return await this.tokenRepo.findOne({
      where: { refreshToken },
      relations: { user: true },
    });
  }

  async save(userId: string, refreshToken): Promise<UserTokenEntity> {
    let tokenData = await this.tokenRepo.findOne({
      where: { userId },
    });
    if (!tokenData) {
      tokenData = new UserTokenEntity();
      tokenData.userId = userId;
    }
    tokenData.refreshToken = refreshToken;
    return this.tokenRepo.save(tokenData);
  }
}
