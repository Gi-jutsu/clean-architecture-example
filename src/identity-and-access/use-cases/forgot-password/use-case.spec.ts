import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import { InMemoryPasswordResetRequestRepository } from "@identity-and-access/infrastructure/repositories/in-memory-password-reset-request.repository.js";
import { beforeEach } from "node:test";
import { describe, expect, it } from "vitest";
import { ForgotPasswordUseCase } from "./use-case.js";

describe("ForgotPasswordUseCase", () => {
  const accounts = new InMemoryAccountRepository();
  const passwordResetRequests = new InMemoryPasswordResetRequestRepository();
  const useCase = new ForgotPasswordUseCase(accounts, passwordResetRequests);

  beforeEach(() => {
    accounts.snapshots.clear();
    passwordResetRequests.snapshots.clear();
  });

  it("should throw an error when attempting to reset password for an unregistered email address", async () => {
    // Given
    const email = "non-registered@call-me-dev.com";

    // When
    const promise = useCase.execute({ email });

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: "resource-not-found",
      title: "Resource Not Found",
      detail: "The Account you are trying to access does not exist.",
      timestamp: expect.any(Date),
      pointer: "/data/attributes/email",
      resource: "Account",
      searchedByFieldName: "email",
      searchedByValue: email,
    });
  });

  it("should initiate the password reset process for an existing account", async () => {
    // Given
    const email = "registered@call-me-dev.com";
    const account = {
      email,
      id: "1",
      password: "password",
    };

    accounts.snapshots.set(account.id, account);

    // When
    await useCase.execute({ email });

    // Then
    expect([...passwordResetRequests.snapshots.values()]).toEqual([
      {
        id: expect.any(String),
        accountId: account.id,
        // @TODO: Implement DateProvider interface in order to ease testing
        expiresAt: expect.any(Date),
        token: expect.any(String),
      },
    ]);
  });
});
