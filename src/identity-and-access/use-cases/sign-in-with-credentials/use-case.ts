import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import type { JwtService } from "@identity-and-access/domain/jwt.service.js";
import { WrongPasswordError } from "./errors/wrong-password.error.js";

export class SignInWithCredentialsUseCase {
  constructor(
    private readonly allAccounts: AccountRepository,
    private readonly jwt: JwtService
  ) {}

  async execute(command: SignInWithCredentialsCommand) {
    const account = await this.allAccounts.findByEmail(command.email);

    if (!account) {
      throw new ResourceNotFoundError({
        resource: "Account",
        searchedByFieldName: "email",
        searchedByValue: command.email,
      });
    }

    if (account.properties.password !== command.password) {
      throw new WrongPasswordError();
    }

    return {
      // @TODO: Retrieve secret from environment variable
      accessToken: this.jwt.sign({ sub: account.id }, "secret"),
    };
  }
}

type SignInWithCredentialsCommand = {
  email: string;
  password: string;
};
