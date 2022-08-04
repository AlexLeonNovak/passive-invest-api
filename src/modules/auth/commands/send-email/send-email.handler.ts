import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from './send-email.command';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  async execute(command: SendEmailCommand): Promise<void> {
    console.log('SendEmailHandler');
    // return Promise.resolve(undefined);
  }
}
