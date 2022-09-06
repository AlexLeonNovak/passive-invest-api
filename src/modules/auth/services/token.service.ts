import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../strategies/jwt.strategy';
import { TokenRepository } from '../repositories/token.repository';

@Injectable()
export class TokenService {
  private readonly jwtRefreshSecret;
  private readonly jwtRefreshExp;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepo: TokenRepository,
  ) {
    this.jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwtRefreshExp = this.configService.get<string>('JWT_REFRESH_EXP');
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: this.jwtRefreshExp,
    });
    await this.tokenRepo.saveToken(payload.id, refreshToken);
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify(token, {
        secret: this.jwtRefreshSecret,
      });
    } catch (e) {
      return null;
    }
  }
}
