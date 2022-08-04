import { CommandBus, CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { UserEntity } from '../../../users/entities/user.entity';
import { GetByEmailQuery } from '../../../users/queries/get-by-email/get-by-email.query';
import { AuthService } from '../../services/auth.service';
import { ConflictException } from '@nestjs/common';
import { UserRegisteredEvent } from '../../events/user-registered/user-registered.event';
import { CreateUserCommand } from '../../../users/commands/create-user/create-user.command';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute({ credentials }: RegisterCommand): Promise<UserEntity> {
    const { email, password } = credentials;
    const candidate = await this.queryBus.execute(new GetByEmailQuery(email));
    if (candidate) {
      throw new ConflictException('User already exist');
    }
    const userInfo = await this.authService.createRegisterInfo(email, password);
    const user = await this.commandBus.execute(new CreateUserCommand(userInfo));
    this.eventBus.publish(new UserRegisteredEvent(user));
    return user;
  }
}
