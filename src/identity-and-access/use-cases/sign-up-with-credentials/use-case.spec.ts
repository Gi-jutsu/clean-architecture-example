import { ResourceAlreadyExistsError } from "@core/errors/resource-already-exists.error.js";
import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import { describe } from "node:test";
import { expect, it } from "vitest";
import { SignUpWithCredentialsUseCase } from "./use-case.js";

describe("SignUpWithCredentialsUseCase", () => {
  const repository = new InMemoryAccountRepository();
  const useCase = new SignUpWithCredentialsUseCase(repository);

  it("should throw a ResourceAlreadyExists when the email is already taken", async () => {
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
    await expect(promise).rejects.toThrow(
      new ResourceAlreadyExistsError({
        conflictingFieldName: "email",
        conflictingFieldValue: "dylan@call-me-dev.com",
        resource: "Account",
      })
    );
  });

  it("should create an account", async () => {
    // Given
    repository.snapshots.clear();

    // When
    const { account } = await useCase.execute({
      email: "dylan@call-me-dev.com",
      password: "password",
    });

    // Then
    expect([...repository.snapshots.values()]).toEqual([
      {
        id: account.id,
        email: "dylan@call-me-dev.com",
        password: "password",
      },
    ]);
  });
});
