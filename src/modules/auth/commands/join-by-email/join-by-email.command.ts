export interface IJoinByEmailCommand {
  email: string;
  password: string;
}

export class JoinByEmailCommand {
  constructor(public readonly credentials: IJoinByEmailCommand) {}
}
