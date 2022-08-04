import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Uuid } from '../../../core/value-objects/uuid';
import { UserRole } from '../../../core/enums/user.enum';
import { QueryBus } from '@nestjs/cqrs';
import { GetByUuidQuery } from '../../users/queries/get-by-uuid/get-by-uuid.query';

export interface JwtPayload {
  uuid: Uuid;
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

  async validate({ uuid }: JwtPayload) {
    const user = await this.queryBus.execute(new GetByUuidQuery(uuid));
    if (!user || !user.isActive()) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
