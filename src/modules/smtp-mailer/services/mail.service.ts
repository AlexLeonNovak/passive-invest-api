import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMailOptions } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

export interface IMail {
  to: string;
  subject: string;
  html?: string;
  context?: {
    [key: string]: any;
  };
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mail: ISendMailOptions) {
    return await this.mailerService.sendMail(mail);
  }

  async sendConfirmEmail(to: string, code: number) {
    return await this.sendMail({
      to,
      subject: 'Confirm your email',
      template: 'confirm-email',
      context: {
        code,
        link: `https://localhost:5000/account/activate/${code}`,
        expire: process.env.CONFIRM_EMAIL_EXPIRE_MINUTES,
      },
    });
  }
}
