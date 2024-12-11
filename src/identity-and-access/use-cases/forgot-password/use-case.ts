import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import { ForgotPasswordRequest } from "@identity-and-access/domain/forgot-password-request/aggregate-root.js";
import type { ForgotPasswordRequestRepository } from "@identity-and-access/domain/forgot-password-request/repository.js";
import { OutboxMessage } from "@shared-kernel/domain/outbox-message/aggregate-root.js";
import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";

export class ForgotPasswordUseCase {
  constructor(
    private readonly allAccounts: AccountRepository,
    private readonly allForgotPasswordRequests: ForgotPasswordRequestRepository,
    private readonly allOutboxMessages: OutboxMessageRepository
  ) {}

  async execute(command: ForgotPasswordCommand) {
    const account = await this.getAccountByEmail(command.email);

    if (await this.allForgotPasswordRequests.hasPendingRequest(account.id)) {
      return;
    }

    const request = ForgotPasswordRequest.create({
      accountId: account.id,
    });

    // @TODO: Must be done in a SQL Transaction
    await this.allForgotPasswordRequests.save(request);
    await this.saveDomainEventsAsOutboxMessages(request);
  }

  private async getAccountByEmail(email: string) {
    const account = await this.allAccounts.findByEmail(email);
    if (!account) {
      throw new ResourceNotFoundError({
        resource: "Account",
        searchedByFieldName: "email",
        searchedByValue: email,
      });
    }
    return account;
  }

  private async saveDomainEventsAsOutboxMessages(
    request: ForgotPasswordRequest
  ) {
    const events = request.pullDomainEvents();
    const messages = events.map(OutboxMessage.createFromDomainEvent);

    await this.allOutboxMessages.save(messages);
  }
}

export type ForgotPasswordCommand = {
  email: string;
};
