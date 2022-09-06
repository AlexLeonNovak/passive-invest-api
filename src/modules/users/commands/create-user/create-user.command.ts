import { UserRole, UserStatuses } from '../../../../core/enums/user.enum';

export interface ICreateUserCommand {
  email: string;
  passwordHash: string;
  roles: UserRole;
  status: UserStatuses;
}

export class CreateUserCommand {
  constructor(public readonly data: ICreateUserCommand) {}
}
