import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './services/mail.service';
import { CqrsModule } from '@nestjs/cqrs';
import { SendEmailHandler } from './commands/send-email/send-email.handler';
import { SendConfirmEmailHandler } from './commands/send-confirm-email/send-confirm-email.handler';

const CommandHandlers = [SendEmailHandler, SendConfirmEmailHandler];
console.log(join(__dirname, './templates/'));
@Module({
  imports: [
    CqrsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: +config.get<number>('SMTP_PORT'),
          secure: config.get('SMTP_SECURE', 'true') === 'true',
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: config.get('SMTP_FROM'),
        },
        template: {
          dir: join(__dirname, './templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [MailerModule],
  providers: [MailService, ...CommandHandlers],
})
export class SmtpMailerModule {}
