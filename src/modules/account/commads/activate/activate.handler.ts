import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ActivateCommand } from './activate.command';
import { BadRequestException } from '@nestjs/common';
import { ActivationCodeService } from '../../services/activation-code.service';
import { UpdateUserCommand } from '../../../users/commands/update-user/update-user.command';
import { UserStatus } from '../../../../core/enums/user.enum';

@CommandHandler(ActivateCommand)
export class ActivateHandler implements ICommandHandler<ActivateCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly codeService: ActivationCodeService,
  ) {}

  async execute(command: ActivateCommand): Promise<any> {
    const { id, code } = command.activate;
    const isCodeValid = await this.codeService.isCodeExpire(id, code);
    if (!isCodeValid) {
      throw new BadRequestException('Activation code expired');
    }
    await this.codeService.clear(id);
    return await this.commandBus.execute(new UpdateUserCommand(id, { status: UserStatus.ACTIVE }));
  }
}
