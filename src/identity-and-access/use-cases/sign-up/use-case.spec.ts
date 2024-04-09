import { describe, expect, it } from "vitest";
import { User } from "@identity-and-access/domain/user/aggregate-root.js";
import { StubUserRepository } from "@identity-and-access/infrastructure/repositories/doubles/stub-user.repository.js";
import { SignUpCommand } from "@identity-and-access/use-cases/sign-up/command.js";
import { SignUpUseCase } from "@identity-and-access/use-cases/sign-up/use-case.js";

describe("SignUpUseCase", () => {
  const repository = new StubUserRepository();
  const useCase = new SignUpUseCase(repository);

  it("should create a new account with the given email and password", async () => {
    // Arrange
    const credentials = {
      email: "user-1@email.com",
      password: "secure-password-1",
    };

    const command = new SignUpCommand({ credentials });

    // Act
    await useCase.execute(command);

    // Assert
    expect(repository.users).toEqual([
      User.hydrate({
        id: expect.any(String),
        credentials,
      }),
    ]);
  });
});
