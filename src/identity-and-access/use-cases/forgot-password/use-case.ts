import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";

export class ForgotPasswordUseCase {
  constructor(private readonly accounts: AccountRepository) {}

  async execute(command: ForgotPasswordCommand) {
    const doesAccountExist = await this.accounts.isEmailTaken(command.email);
    if (!doesAccountExist) {
      throw new ResourceNotFoundError({
        resource: "Account",
        searchedByFieldName: "email",
        searchedByValue: command.email,
      });
    }
  }
}

export type ForgotPasswordCommand = {
  email: string;
};
