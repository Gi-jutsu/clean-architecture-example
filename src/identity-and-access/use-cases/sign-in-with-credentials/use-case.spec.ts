import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import jwt from "jsonwebtoken";
import { describe } from "node:test";
import { expect, it } from "vitest";
import { SignInWithCredentialsUseCase } from "./use-case.js";

describe("SignInWithCredentialsUseCase", () => {
  const repository = new InMemoryAccountRepository();
  const useCase = new SignInWithCredentialsUseCase(repository, jwt);

  it("should throw a ResourceNotFoundError when the user does not exist", async () => {
    // Given
    repository.snapshots.clear();

    // When
    const promise = useCase.execute({
      email: "dylan@call-me-dev.com",
      password: "password",
    });

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: "resource-not-found",
      title: "Resource Not Found",
      detail: "The Account you are trying to access does not exist.",
      timestamp: expect.any(Date),
      pointer: "/data/attributes/email",
    });
  });

  it("should throw a WrongPasswordError when the password is incorrect", async () => {
    // Given
    const snapshot = {
      email: "dylan@call-me-dev.com",
      password: "password",
    };

    repository.snapshots.set("1", snapshot);

    // When
    const promise = useCase.execute({
      email: "dylan@call-me-dev.com",
      password: "wrong-password",
    });

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 401,
      code: "wrong-password",
      title: "Unauthorized",
      detail: "The password you entered is incorrect. Please try again.",
      timestamp: expect.any(Date),
      pointer: "/data/attributes/password",
    });
  });
});
