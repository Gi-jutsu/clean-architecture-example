import { describe, expect, it } from "vitest";
import { StubUserRepository } from "../../infrastructure/repositories/doubles/stub-user.repository";
import { SignUpCommand } from "./command";
import { SignUpUseCase } from "./use-case";

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
      {
        id: expect.any(String),
        credentials: {
          email: credentials.email,
          password: credentials.password,
        },
      },
    ]);
  });
});
