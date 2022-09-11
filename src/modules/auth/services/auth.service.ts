import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/entities/user.entity';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { AuthSourcesService, IExtraPasswordHash } from './auth-sources.service';
import { UserAuthSourcesEntity } from '../entities/user-auth-sources.entity';

export interface IUserAuthPayload {
  user: UserEntity;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUserByEmail {
  user: UserEntity;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly authSourcesService: AuthSourcesService,
  ) {}

  async registerByEmail({ user, email, password }: IUserByEmail): Promise<UserAuthSourcesEntity<IExtraPasswordHash>> {
    const passwordHash = await this.passwordService.hash(password);
    return await this.authSourcesService.createEmailSourceData({
      user,
      email,
      passwordHash,
    });
  }

  async loginByEmail(
    source: UserAuthSourcesEntity<IExtraPasswordHash>,
    password: string,
  ): Promise<IUserAuthPayload | false> {
    const isPasswordEqual = await this.passwordService.compare(password, source.extraFields.passwordHash);
    if (!isPasswordEqual) {
      return false;
    }
    return this.getAuthPayload(source.user);
  }

  async getAuthPayload(user: UserEntity) {
    const { id, roles } = user;
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({ id, roles });
    return { user, refreshToken, accessToken };
  }

  async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
  }
}
