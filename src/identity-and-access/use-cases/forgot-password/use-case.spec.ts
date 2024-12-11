import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import { InMemoryForgotPasswordRequestRepository } from "@identity-and-access/infrastructure/repositories/in-memory-forgot-password-request.repository.js";
import { InMemoryOutboxMessageRepository } from "@shared-kernel/infrastructure/repositories/in-memory-outbox-message.repository.js";
import { DateTime, Settings } from "luxon";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ForgotPasswordUseCase } from "./use-case.js";

describe("ForgotPasswordUseCase", () => {
  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  it("should throw an error when attempting to reset password for an unregistered email address", async () => {
    // Given
    const { useCase } = createSystemUnderTest();

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
    const { allAccounts, allForgotPasswordRequests, useCase } =
      createSystemUnderTest();

    const account = {
      email: "registered@call-me-dev.com",
      id: "1",
      password: "password",
    };

    allAccounts.snapshots.set(account.id, account);

    // When
    await useCase.execute({
      email: account.email,
    });

    // Then
    expect([...allForgotPasswordRequests.snapshots.values()]).toEqual([
      {
        id: expect.any(String),
        accountId: account.id,
        expiresAt: DateTime.now().plus({ days: 1 }),
        token: expect.any(String),
      },
    ]);
  });

  // @TODO: Later on we should refresh the password reset request token and expiration date and send a new email
  it("should return the same password reset request when the password reset process has already been initiated", async () => {
    // Given
    const { allAccounts, allForgotPasswordRequests, useCase } =
      createSystemUnderTest();

    const account = {
      email: "registered@call-me-dev.com",
      id: "1",
      password: "password",
    };

    const existingForgotPasswordRequest = {
      id: "reset-1",
      accountId: account.id,
      expiresAt: DateTime.now().plus({ days: 1 }),
      token: "existing-token",
    };

    allAccounts.snapshots.set(account.id, account);
    allForgotPasswordRequests.snapshots.set(
      existingForgotPasswordRequest.id,
      existingForgotPasswordRequest
    );

    // When
    await useCase.execute({
      email: account.email,
    });

    // Then
    expect([...allForgotPasswordRequests.snapshots.values()]).toEqual([
      existingForgotPasswordRequest,
    ]);
  });

  it("should save a ForgotPasswordRequestedDomainEvent to the outbox upon successfully requesting a password reset", async () => {
    // Given
    const { allAccounts, allOutboxMessages, useCase } = createSystemUnderTest();

    const account = {
      email: "registered@call-me-dev.com",
      id: "1",
      password: "password",
    };

    allAccounts.snapshots.set(account.id, account);

    // When
    await useCase.execute({
      email: account.email,
    });

    // Then
    expect([...allOutboxMessages.snapshots.values()]).toEqual([
      {
        errorMessage: null,
        eventType: "ForgotPasswordRequestedDomainEvent",
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

function createSystemUnderTest() {
  const allAccounts = new InMemoryAccountRepository();
  const allForgotPasswordRequests =
    new InMemoryForgotPasswordRequestRepository();
  const allOutboxMessages = new InMemoryOutboxMessageRepository();

  const useCase = new ForgotPasswordUseCase(
    allAccounts,
    allForgotPasswordRequests,
    allOutboxMessages
  );

  return { allAccounts, allForgotPasswordRequests, allOutboxMessages, useCase };
}
