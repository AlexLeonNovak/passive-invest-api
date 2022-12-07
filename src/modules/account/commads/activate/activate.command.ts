export interface IActivateCommand {
  id: string;
  code: number;
}

export class ActivateCommand {
  constructor(public readonly activate: IActivateCommand) {}
}
