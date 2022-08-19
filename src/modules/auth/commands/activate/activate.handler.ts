import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ActivateCommand } from './activate.command';
import { GetByEmailQuery } from '../../../users/queries/get-by-email/get-by-email.query';
import { UnauthorizedException } from '@nestjs/common';
import { ActivationCodeService } from '../../services/activation-code.service';
import { AuthService } from '../../services/auth.service';
import { UpdateUserCommand } from '../../../users/commands/update-user/update-user.command';
import { UserStatuses } from '../../../../core/enums/user.enum';

@CommandHandler(ActivateCommand)
export class ActivateHandler implements ICommandHandler<ActivateCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly codeService: ActivationCodeService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: ActivateCommand): Promise<any> {
    const { email, code } = command.activate;
    let user = await this.queryBus.execute(new GetByEmailQuery(email));
    if (!user) {
      throw new UnauthorizedException('Activation code expired');
    }
    const isCodeValid = await this.codeService.isCodeExpire(user.uuid, code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Activation code expired');
    }
    user = await this.commandBus.execute(new UpdateUserCommand(user.uuid, { status: UserStatuses.ACTIVE }));
    return this.authService.getAuthPayload(user);
  }
}
