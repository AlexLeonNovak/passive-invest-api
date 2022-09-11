import { Injectable } from '@nestjs/common';
import { AuthSourceRepository } from '../repositories/auth-source.repository';
import { UserAuthProvider } from '../../../core/enums/user.enum';
import { UserAuthSourcesEntity } from '../entities/user-auth-sources.entity';
import { UserEntity } from '../../users/entities/user.entity';

export type IExtraPasswordHash = {
  // extraFields: {
  passwordHash: string;
  // };
};

export interface IEmailSource {
  user: UserEntity;
  email: string;
  passwordHash: string;
}

@Injectable()
export class AuthSourcesService {
  constructor(private readonly repo: AuthSourceRepository) {}

  async createEmailSourceData({
    email,
    passwordHash,
    user,
  }: IEmailSource): Promise<UserAuthSourcesEntity<IExtraPasswordHash>> {
    return await this.repo.create({
      user,
      provider: UserAuthProvider.LOCAL,
      identifier: email,
      extraFields: { passwordHash },
    });
  }

  async getByEmail(email: string): Promise<UserAuthSourcesEntity<IExtraPasswordHash>> {
    return await this.repo.findOne({
      identifier: email,
      provider: UserAuthProvider.LOCAL,
    });
  }
}
