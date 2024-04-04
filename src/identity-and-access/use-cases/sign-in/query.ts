export class SignInQuery {
  public readonly credentials: {
    email: string;
    password: string;
  };

  constructor(input: SignInQuery) {
    this.credentials = input.credentials;
  }
}
