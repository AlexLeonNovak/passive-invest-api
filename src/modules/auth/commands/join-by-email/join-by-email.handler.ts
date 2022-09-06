import { CommandBus, CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { JoinByEmailCommand } from './join-by-email.command';
import { AuthService, IUserAuthPayload } from '../../services/auth.service';
import { GetByEmailQuery } from '../../../users/queries/get-by-email/get-by-email.query';
import { CreateUserCommand } from '../../../users/commands/create-user/create-user.command';
import { UserRegisteredEvent } from '../../events/user-registered/user-registered.event';
import { BadRequestException } from '@nestjs/common';
import { UserLoggedInEvent } from '../../events/user-logged-in/user-logged-in.event';

@CommandHandler(JoinByEmailCommand)
export class JoinByEmailHandler implements ICommandHandler<JoinByEmailCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: JoinByEmailCommand): Promise<IUserAuthPayload> {
    const { email, password } = command.credentials;
    let user = await this.queryBus.execute(new GetByEmailQuery(email));
    if (!user) {
      const userInfo = await this.authService.createRegisterInfo(email, password);
      user = await this.commandBus.execute(new CreateUserCommand(userInfo));
      this.eventBus.publish(new UserRegisteredEvent(user));
    }

    const payload = await this.authService.login(user, password);
    if (!payload) {
      throw new BadRequestException('Wrong email or password');
    }
    this.eventBus.publish(new UserLoggedInEvent(user));
    return payload;
  }
}
