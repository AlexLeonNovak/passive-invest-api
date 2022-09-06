import { UserRole, UserStatuses } from '../../../../core/enums/user.enum';

export interface IUpdateUserCommand {
  roles?: UserRole;
  status?: UserStatuses;
}

export class UpdateUserCommand {
  constructor(public readonly id: string, public readonly update: IUpdateUserCommand) {}
}
