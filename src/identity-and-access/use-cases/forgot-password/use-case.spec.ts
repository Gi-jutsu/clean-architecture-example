import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import { ForgotPasswordRequest } from "@identity-and-access/domain/forgot-password-request/aggregate-root.js";
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

  it("should refresh the token and expiration date when the password reset process has already been initiated", async () => {
    // Given
    const { allAccounts, allForgotPasswordRequests, useCase } =
      createSystemUnderTest();

    // @todo(dev-ux): impl Object Mother
    // @see https://martinfowler.com/bliki/ObjectMother.html
    const account = Account.fromSnapshot({
      email: "user@example.com",
      password: "hashed-password",
      id: "account-1",
    });

    const request = ForgotPasswordRequest.fromSnapshot({
      accountId: account.id,
      expiresAt: DateTime.now().plus({ days: 1 }),
      id: "request-1",
      token: "token",
    });

    allAccounts.snapshots.set(account.id, account.properties);
    // @todo(bug): "TypeError: Cannot assign to read only property 'token' of object '#<Object>'"
    // consider implementing a proper snapshot pattern
    allForgotPasswordRequests.snapshots.set(request.id, {
      ...request.properties,
    });

    // When
    await useCase.execute({
      email: account.properties.email,
    });

    // Then
    const snapshots = [...allForgotPasswordRequests.snapshots.values()];
    expect(snapshots).toEqual([
      {
        id: request.id,
        accountId: account.id,
        expiresAt: DateTime.now().plus({ days: 1 }),
        token: expect.not.stringMatching(request.properties.token),
      },
    ]);
  });

  it("should save a ForgotPasswordRequestCreatedDomainEvent to the outbox upon successfully requesting a password reset", async () => {
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
        eventType: "ForgotPasswordRequestCreatedDomainEvent",
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
