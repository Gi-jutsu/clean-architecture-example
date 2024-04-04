import { describe, expect, it } from "vitest";
import { StubUserRepository } from "../../infrastructure/repositories/doubles/stub-user.repository";
import { SignInQuery } from "./query";
import { SignInUseCase } from "./use-case";

describe("SignInUseCase", () => {
  const repository = new StubUserRepository();
  const useCase = new SignInUseCase(repository);

  it("should throw an error when the user does not exist", async () => {
    // Arrange
    const credentials = {
      email: "user-1@email.com",
      password: "wrong-password",
    };

    const query = new SignInQuery({ credentials });

    // Act
    const execute = () => useCase.execute(query);

    // Assert
    await expect(execute).rejects.toThrowError();
  });

  it("should return an access and refresh token", async () => {
    // Arrange
    const credentials = {
      email: "user-1@email.com",
      password: "secured-password-1",
    };

    const query = new SignInQuery({ credentials });

    repository.users.push({
      id: "user-1",
      credentials: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    // Act
    const output = await useCase.execute(query);

    // Assert
    expect(output).toEqual({
      accessToken: "",
      refreshToken: "",
    });
  });
});
