import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendConfirmEmailCommand } from './send-confirm-email.command';
import { MailService } from '../../services/mail.service';

@CommandHandler(SendConfirmEmailCommand)
export class SendConfirmEmailHandler implements ICommandHandler<SendConfirmEmailCommand> {
  constructor(private readonly mailService: MailService) {}

  async execute(command: SendConfirmEmailCommand): Promise<any> {
    const { to, code } = command.mail;
    await this.mailService.sendConfirmEmail(to, code);
  }
}
