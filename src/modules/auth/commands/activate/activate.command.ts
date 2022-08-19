export interface IActivateCommand {
  email: string;
  code: number;
}

export class ActivateCommand {
  constructor(public readonly activate: IActivateCommand) {}
}
