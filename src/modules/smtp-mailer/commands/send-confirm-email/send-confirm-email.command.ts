export interface ISendConfirmEmailCommand {
  to: string;
  code: number;
}

export class SendConfirmEmailCommand {
  constructor(public readonly mail: ISendConfirmEmailCommand) {}
}
