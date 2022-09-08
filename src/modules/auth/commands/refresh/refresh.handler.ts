import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { AuthService, IUserAuthPayload } from '../../services/auth.service';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute({ user }: RefreshCommand): Promise<IUserAuthPayload> {
    return await this.authService.getAuthPayload(user);
  }
}
