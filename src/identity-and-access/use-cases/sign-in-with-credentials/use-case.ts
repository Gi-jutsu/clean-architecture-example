import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import type { Jwt } from "@identity-and-access/domain/jwt.port.js";
import type { PasswordHasher } from "@identity-and-access/domain/password-hasher.port.js";
import { WrongPasswordError } from "./errors/wrong-password.error.js";

export class SignInWithCredentialsUseCase {
  constructor(
    private readonly allAccounts: AccountRepository,
    private readonly jwt: Jwt,
    private readonly passwordHasher: PasswordHasher
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

    const isPasswordCorrect = await this.passwordHasher.compare(
      command.password,
      account.properties.password
    );

    if (!isPasswordCorrect) {
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
