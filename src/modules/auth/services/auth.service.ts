import { Injectable } from '@nestjs/common';
// import { UserRepository } from '../../users/repositories/user.repository';
import { UserEntity } from '../../users/entities/user.entity';
import { Uuid } from '../../../core/value-objects/uuid';
import { UserRole, UserStatuses } from '../../../core/enums/user.enum';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

export interface IUserAuthPayload {
  user: UserEntity;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUserRegisterInfo {
  uuid: Uuid;
  email: string;
  passwordHash: string;
  status: UserStatuses;
  roles: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    // private readonly userRepo: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async createRegisterInfo(email: string, password: string): Promise<IUserRegisterInfo> {
    // console.log('AuthService.create');
    const passwordHash = await this.passwordService.hash(password);
    return {
      uuid: Uuid.generate(),
      email,
      passwordHash,
      status: UserStatuses.NEW,
      roles: UserRole.USER,
    };
    // const newUser = await this.userRepo.create(user);
    // return { user: newUser };
  }

  async login(user: UserEntity, password: string): Promise<IUserAuthPayload | false> {
    const isPasswordEqual = await this.passwordService.compare(password, user.passwordHash);
    if (!isPasswordEqual) {
      return false;
    }
    const { uuid, email, roles } = user;
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({ uuid, email, roles });
    return { user, refreshToken, accessToken };
  }
}
