import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import { InMemoryPasswordResetRequestRepository } from "@identity-and-access/infrastructure/repositories/in-memory-password-reset-request.repository.js";
import { InMemoryOutboxMessageRepository } from "@shared-kernel/infrastructure/repositories/in-memory-outbox-message.repository.js";
import { DateTime, Settings } from "luxon";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ForgotPasswordUseCase } from "./use-case.js";

describe("ForgotPasswordUseCase", () => {
  const accounts = new InMemoryAccountRepository();
  const passwordResetRequests = new InMemoryPasswordResetRequestRepository();
  const outboxMessages = new InMemoryOutboxMessageRepository();
  const useCase = new ForgotPasswordUseCase(
    accounts,
    passwordResetRequests,
    outboxMessages
  );

  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  beforeEach(() => {
    accounts.snapshots.clear();
    passwordResetRequests.snapshots.clear();
    outboxMessages.snapshots.clear();
  });

  it("should throw an error when attempting to reset password for an unregistered email address", async () => {
    // Given
    const email = "non-registered@call-me-dev.com";

    // When
    const promise = useCase.execute({
      email,
    });

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: "resource-not-found",
      title: "Resource Not Found",
      detail: "The Account you are trying to access does not exist.",
      timestamp: DateTime.now(),
      pointer: "/data/attributes/email",
      resource: "Account",
      searchedByFieldName: "email",
      searchedByValue: email,
    });
  });

  it("should initiate the password reset process for an existing account", async () => {
    // Given
    const account = {
      email: "registered@call-me-dev.com",
      id: "1",
      password: "password",
    };

    accounts.snapshots.set(account.id, account);

    // When
    await useCase.execute({
      email: account.email,
    });

    // Then
    expect([...passwordResetRequests.snapshots.values()]).toEqual([
      {
        id: expect.any(String),
        accountId: account.id,
        expiresAt: DateTime.now().plus({ days: 1 }),
        token: expect.any(String),
      },
    ]);
  });

  it("should save a PasswordResetRequestedDomainEvent to the outbox upon successfully requesting a password reset", async () => {
    // Given
    const account = {
      email: "registered@call-me-dev.com",
      id: "1",
      password: "password",
    };

    accounts.snapshots.set(account.id, account);

    // When
    await useCase.execute({
      email: account.email,
    });

    // Then
    expect([...outboxMessages.snapshots.values()]).toEqual([
      {
        errorMessage: null,
        eventType: "PasswordResetRequestedDomainEvent",
        id: expect.any(String),
        payload: {
          accountId: "1",
          expiresAt: DateTime.now().plus({ days: 1 }),
          id: expect.any(String),
          token: expect.any(String),
        },
        processedAt: null,
      },
    ]);
  });
});
