import { describe, expect, it } from "vitest";
import { User } from "@identity-and-access/domain/user/aggregate-root.js";
import { InMemoryUserRepository } from "@identity-and-access/infrastructure/repositories/in-memory/in-memory-user.repository.js";
import { SignUpCommand } from "@identity-and-access/use-cases/sign-up/command.js";
import { SignUpUseCase } from "@identity-and-access/use-cases/sign-up/use-case.js";

describe("SignUpUseCase", () => {
  const allUsers = new InMemoryUserRepository();
  const useCase = new SignUpUseCase(allUsers);

  it("should create a new account with the given email and password", async () => {
    // Arrange
    const credentials = {
      email: "user-1@email.com",
      password: "secure-password-1",
    };

    // Act
    const command = new SignUpCommand({ credentials });
    await useCase.execute(command);

    // Assert
    expect(allUsers.records).toEqual([
      User.hydrate({
        id: expect.any(String),
        credentials,
      }),
    ]);
  });
});
