import { ResourceNotFoundError } from "@core/errors/resource-not-found.error.js";
import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import jwt from "jsonwebtoken";
import { describe } from "node:test";
import { expect, it } from "vitest";
import { WrongPasswordError } from "./errors/wrong-password.error.js";
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
    await expect(promise).rejects.toThrow(
      new ResourceNotFoundError({
        resource: "Account",
        searchedByFieldName: "email",
        searchedByValue: "dylan@call-me-dev.com",
      })
    );
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
    await expect(promise).rejects.toThrow(new WrongPasswordError());
  });
});
