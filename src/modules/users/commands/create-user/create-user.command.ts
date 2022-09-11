import { UserRole, UserStatus } from '../../../../core/enums/user.enum';

export interface ICreateUserCommand {
  roles: UserRole;
  status: UserStatus;
}

export class CreateUserCommand {
  constructor(public readonly data?: ICreateUserCommand) {
    this.data = {
      roles: UserRole.USER,
      status: UserStatus.NEW,
    };
  }
}
