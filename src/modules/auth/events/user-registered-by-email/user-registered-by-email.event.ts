import { UserEntity } from '../../../users/entities/user.entity';

export class UserRegisteredByEmailEvent {
  constructor(public readonly user: UserEntity, public readonly email: string) {}
}
