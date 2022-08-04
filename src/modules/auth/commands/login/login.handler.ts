import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { AuthService } from '../../services/auth.service';
import { GetByEmailQuery } from '../../../users/queries/get-by-email/get-by-email.query';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserLoggedInEvent } from '../../events/user-logged-in/user-logged-in.event';
import { NotFoundError } from 'rxjs';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ credentials }: LoginCommand): Promise<any> {
    const { email, password } = credentials;
    const user = await this.queryBus.execute(new GetByEmailQuery(email));
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const payload = await this.authService.login(user, password);
    if (!payload) {
      throw new BadRequestException('Wrong email or password');
    }

    if (!payload.user.isActive()) {
      throw new ForbiddenException('Account is not active');
    }

    this.eventBus.publish(new UserLoggedInEvent(user));
    return payload;
  }
}
