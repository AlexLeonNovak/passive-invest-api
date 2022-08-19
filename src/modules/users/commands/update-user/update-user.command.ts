import { UserRole, UserStatuses } from '../../../../core/enums/user.enum';
import { Uuid } from '../../../../core/value-objects/uuid';

export interface IUpdateUserCommand {
  roles?: UserRole;
  status?: UserStatuses;
}

export class UpdateUserCommand {
  constructor(public readonly uuid: Uuid, public readonly update: IUpdateUserCommand) {}
}
