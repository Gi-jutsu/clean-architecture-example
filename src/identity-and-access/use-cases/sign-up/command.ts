export class SignUpCommand {
  public readonly credentials: {
    email: string;
    password: string;
  };

  constructor(input: SignUpCommand) {
    this.credentials = input.credentials;
  }
}
