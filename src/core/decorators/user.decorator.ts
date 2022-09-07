import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/users/entities/user.entity';

export const User = createParamDecorator(
  (_, ctx: ExecutionContext): UserEntity => ctx.switchToHttp().getRequest().user as UserEntity,
);
