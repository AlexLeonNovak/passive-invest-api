export interface ISendEmail {
  to: string;
  subject: string;
  body: string;
}

export class SendEmailCommand {
  constructor(public readonly email: ISendEmail) {}
}
