import { ResourceAlreadyExistsError } from "@core/errors/resource-already-exists.error.js";
import { FakePasswordHasher } from "@identity-and-access/infrastructure/fake-password-hasher.js";
import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import { DateTime, Settings } from "luxon";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { SignUpWithCredentialsUseCase } from "./use-case.js";

describe("SignUpWithCredentialsUseCase", () => {
  const allAccounts = new InMemoryAccountRepository();
  const useCase = new SignUpWithCredentialsUseCase(
    allAccounts,
    new FakePasswordHasher()
  );

  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  afterEach(() => {
    allAccounts.snapshots.clear();
  });

  it("should throw a ResourceAlreadyExists when the email is already taken", async () => {
    // Given
    const account = {
      email: "dylan@call-me-dev.com",
      id: "1",
      password: "password",
    };

    allAccounts.snapshots.set(account.id, account);

    try {
      // When
      await useCase.execute({
        email: "dylan@call-me-dev.com",
        password: "wrong-password",
      });

      expect(true).toBe(false);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);
      expect(error).toMatchObject({
        status: 409,
        code: "resource-already-exists",
        title: "Resource Already Exists",
        detail: "The Account you are trying to create already exists.",
        timestamp: DateTime.now(),
        pointer: "/data/attributes/email",
        conflictingFieldName: "email",
        conflictingFieldValue: "dylan@call-me-dev.com",
        resource: "Account",
      });
    }
  });

  it("should create an account with a hashed password", async () => {
    // Given
    const credentials = {
      email: "dylan@call-me-dev.com",
      password: "password",
    };

    // When
    const { account } = await useCase.execute(credentials);

    // Then
    expect([...allAccounts.snapshots.values()]).toEqual([
      {
        id: account.id,
        email: credentials.email,
        password: "hashed-password",
      },
    ]);
  });
});
