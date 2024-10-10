import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import { PasswordResetRequest } from "@identity-and-access/domain/password-reset-request/aggregate-root.js";
import type { PasswordResetRequestRepository } from "@identity-and-access/domain/password-reset-request/repository.js";

export class ForgotPasswordUseCase {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly passwordResetRequests: PasswordResetRequestRepository
  ) {}

  async execute(command: ForgotPasswordCommand) {
    const account = await this.accounts.findByEmail(command.email);
    if (!account) {
      throw new ResourceNotFoundError({
        resource: "Account",
        searchedByFieldName: "email",
        searchedByValue: command.email,
      });
    }

    const request = PasswordResetRequest.create({
      accountId: account.id,
    });

    await this.passwordResetRequests.save(request);
  }
}

export type ForgotPasswordCommand = {
  email: string;
};
