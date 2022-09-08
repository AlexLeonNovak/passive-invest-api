import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { AuthService } from '../../services/auth.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute({ refreshToken }: LogoutCommand): Promise<void> {
    await this.authService.logout(refreshToken);
  }
}
