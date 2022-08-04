export interface ILoginCommand {
  email: string;
  password: string;
}

export class LoginCommand {
  constructor(public readonly credentials: ILoginCommand) {}
}
