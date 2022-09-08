import { UserEntity } from '../../../users/entities/user.entity';

export class RefreshCommand {
  constructor(public readonly user: UserEntity) {}
}
