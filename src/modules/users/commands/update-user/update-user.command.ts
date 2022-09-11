import { UserRole, UserStatus } from '../../../../core/enums/user.enum';

export interface IUpdateUserCommand {
  roles?: UserRole;
  status?: UserStatus;
}

export class UpdateUserCommand {
  constructor(public readonly id: string, public readonly update: IUpdateUserCommand) {}
}
