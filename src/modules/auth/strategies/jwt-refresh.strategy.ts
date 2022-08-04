import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from '../services/token.service';
import { JwtPayload } from './jwt.strategy';
import { TokenRepository } from '../repositories/token.repository';

export const COOKIE_REFRESH_TOKEN_KEY = 'refreshToken';

const cookieExtractor = (request: Request) => {
  if (request && request.signedCookies) {
    return request.signedCookies[COOKIE_REFRESH_TOKEN_KEY];
  }
  return null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly tokenRepo: TokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const refreshToken = cookieExtractor(request);
    const tokenValid = refreshToken && this.tokenService.validateRefreshToken(refreshToken);
    if (!tokenValid) {
      throw new UnauthorizedException();
    }

    const userToken = await this.tokenRepo.findByRefreshToken(refreshToken);
    if (!userToken?.user?.isActive()) {
      throw new UnauthorizedException();
    }

    return userToken.user;
  }
}
