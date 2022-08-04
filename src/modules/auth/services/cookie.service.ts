import { Response, CookieOptions } from 'express';
import { COOKIE_REFRESH_TOKEN_KEY } from '../strategies/jwt-refresh.strategy';

export class CookieService {
  private static readonly cookieOptions: CookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
  };

  static setRefreshToken(response: Response, refreshToken: string): void {
    response.cookie(COOKIE_REFRESH_TOKEN_KEY, refreshToken, this.cookieOptions);
  }

  static removeRefreshToken(response: Response) {
    response.clearCookie(COOKIE_REFRESH_TOKEN_KEY);
  }
}
