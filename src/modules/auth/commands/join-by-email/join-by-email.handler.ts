import { CommandBus, CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { JoinByEmailCommand } from './join-by-email.command';
import { AuthService, IUserAuthPayload } from '../../services/auth.service';
import { CreateUserCommand } from '../../../users/commands/create-user/create-user.command';
import { UserRegisteredByEmailEvent } from '../../events/user-registered-by-email/user-registered-by-email.event';
import { BadRequestException } from '@nestjs/common';
import { UserLoggedInEvent } from '../../events/user-logged-in/user-logged-in.event';
import { AuthSourcesService } from '../../services/auth-sources.service';

@CommandHandler(JoinByEmailCommand)
export class JoinByEmailHandler implements ICommandHandler<JoinByEmailCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly authSourceService: AuthSourcesService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: JoinByEmailCommand): Promise<IUserAuthPayload> {
    const { email, password } = command.credentials;
    let source = await this.authSourceService.getByEmail(email);
    if (!source) {
      const user = await this.commandBus.execute(new CreateUserCommand());
      source = await this.authService.registerByEmail({ user, email, password });
      this.eventBus.publish(new UserRegisteredByEmailEvent(user, email));
    }

    const payload = await this.authService.loginByEmail(source, password);
    if (!payload) {
      throw new BadRequestException('Wrong email or password');
    }
    this.eventBus.publish(new UserLoggedInEvent(source.user));
    return payload;
  }
}
