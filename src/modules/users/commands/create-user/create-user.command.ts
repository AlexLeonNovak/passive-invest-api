import { UserRole, UserStatuses } from '../../../../core/enums/user.enum';
import { Uuid } from '../../../../core/value-objects/uuid';

export interface ICreateUserCommand {
  uuid?: Uuid;
  email: string;
  passwordHash: string;
  roles: UserRole;
  status: UserStatuses;
}

export class CreateUserCommand {
  constructor(public readonly data: ICreateUserCommand) {}
}
