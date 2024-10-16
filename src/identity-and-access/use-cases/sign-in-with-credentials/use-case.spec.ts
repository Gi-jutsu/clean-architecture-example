import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import jwt from "jsonwebtoken";
import { DateTime, Settings } from "luxon";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { SignInWithCredentialsUseCase } from "./use-case.js";

describe("SignInWithCredentialsUseCase", () => {
  const repository = new InMemoryAccountRepository();
  const useCase = new SignInWithCredentialsUseCase(repository, jwt);

  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  afterEach(() => {
    repository.snapshots.clear();
  });

  it("should throw a ResourceNotFoundError when the user does not exist", async () => {
    // Given
    const credentials = {
      email: "dylan@call-me-dev.com",
      password: "password",
    };

    // When
    const promise = useCase.execute(credentials);

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: "resource-not-found",
      title: "Resource Not Found",
      detail: "The Account you are trying to access does not exist.",
      timestamp: DateTime.now(),
      pointer: "/data/attributes/email",
    });
  });

  it("should throw a WrongPasswordError when the password is incorrect", async () => {
    // Given
    const account = {
      email: "dylan@call-me-dev.com",
      id: "1",
      password: "password",
    };

    repository.snapshots.set(account.id, account);

    // When
    const promise = useCase.execute({
      email: account.email,
      password: "wrong-password",
    });

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 401,
      code: "wrong-password",
      title: "Unauthorized",
      detail: "The password you entered is incorrect. Please try again.",
      timestamp: DateTime.now(),
      pointer: "/data/attributes/password",
    });
  });
});
