import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole, UserStatuses } from '../../../core/enums/user.enum';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

export interface IUserAuthPayload {
  user: UserEntity;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUserRegisterInfo {
  id?: string;
  email: string;
  passwordHash: string;
  status: UserStatuses;
  roles: UserRole;
}

@Injectable()
export class AuthService {
  constructor(private readonly passwordService: PasswordService, private readonly tokenService: TokenService) {}

  async createRegisterInfo(email: string, password: string): Promise<IUserRegisterInfo> {
    const passwordHash = await this.passwordService.hash(password);
    return {
      email,
      passwordHash,
      status: UserStatuses.NEW,
      roles: UserRole.USER,
    };
  }

  async login(user: UserEntity, password: string): Promise<IUserAuthPayload | false> {
    const isPasswordEqual = await this.passwordService.compare(password, user.passwordHash);
    if (!isPasswordEqual) {
      return false;
    }
    return this.getAuthPayload(user);
  }

  async getAuthPayload(user: UserEntity) {
    const { id, email, roles } = user;
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({ id, email, roles });
    return { user, refreshToken, accessToken };
  }

  async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
  }
}
