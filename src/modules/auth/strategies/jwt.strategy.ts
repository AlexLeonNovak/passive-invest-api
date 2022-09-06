import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../core/enums/user.enum';
import { QueryBus } from '@nestjs/cqrs';
import { GetByIdQuery } from '../../users/queries/get-by-id/get-by-id.query';

export interface JwtPayload {
  id: string;
  email: string;
  roles: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate({ id }: JwtPayload) {
    const user = await this.queryBus.execute(new GetByIdQuery(id));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
