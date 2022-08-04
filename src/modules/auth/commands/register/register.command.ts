export interface IRegisterCommand {
  email: string;
  password: string;
}

export class RegisterCommand {
  constructor(public readonly credentials: IRegisterCommand) {}
}
