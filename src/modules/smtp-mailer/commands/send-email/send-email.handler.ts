import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from './send-email.command';
import { MailService } from '../../services/mail.service';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  constructor(private readonly mailService: MailService) {}

  async execute({ email }: SendEmailCommand): Promise<void> {
    await this.mailService.sendMail({ ...email });
  }
}
