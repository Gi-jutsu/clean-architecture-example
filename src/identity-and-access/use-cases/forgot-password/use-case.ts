import { ResourceNotFoundError } from "@shared-kernel/domain/errors/resource-not-found.error.js";
import type { Account } from "@identity-and-access/domain/account/aggregate-root.js";
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
    const account = await this.findAccountByEmailOrThrow(command.email);
    const { hasBeenCreated, request } =
      await this.findOrCreateForgotPasswordRequest(account);

    if (!hasBeenCreated) {
      request.refresh();
    }

    // @TODO: Must be done in a SQL Transaction
    await this.allForgotPasswordRequests.save(request);
    await this.saveDomainEventsAsOutboxMessages(request);
  }

  private async findAccountByEmailOrThrow(email: string) {
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

  private async findOrCreateForgotPasswordRequest(account: Account) {
    const existingRequest =
      await this.allForgotPasswordRequests.findByAccountId(account.id);

    if (existingRequest) {
      return { hasBeenCreated: false, request: existingRequest };
    }

    const newRequest = ForgotPasswordRequest.create({
      accountId: account.id,
    });

    return { hasBeenCreated: true, request: newRequest };
  }

  private async saveDomainEventsAsOutboxMessages(
    request: ForgotPasswordRequest
  ) {
    const events = request.pullDomainEvents();
    const messages = events.map(OutboxMessage.fromDomainEvent);

    await this.allOutboxMessages.save(messages);
  }
}

export type ForgotPasswordCommand = {
  email: string;
};
