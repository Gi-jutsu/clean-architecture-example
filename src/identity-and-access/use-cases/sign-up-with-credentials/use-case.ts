import { ResourceAlreadyExistsError } from "@core/errors/resource-already-exists.error.js";
import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";

export class SignUpWithCredentialsUseCase {
  constructor(private readonly allAccounts: AccountRepository) {}

  async execute(command: SignInWithCredentialsCommand) {
    const isEmailTaken = await this.allAccounts.isEmailTaken(command.email);
    if (isEmailTaken) {
      throw new ResourceAlreadyExistsError({
        conflictingFieldName: "email",
        conflictingFieldValue: command.email,
        resource: "Account",
      });
    }

    const account = Account.create({
      email: command.email,
      password: command.password,
    });

    await this.allAccounts.save(account);

    return {
      account: { id: account.id },
    };
  }
}

type SignInWithCredentialsCommand = {
  email: string;
  password: string;
};
