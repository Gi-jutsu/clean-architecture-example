import { describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "@identity-and-access/infrastructure/repositories/doubles/in-memory-user.repository.js";
import { SignInQuery } from "@identity-and-access/use-cases/sign-in/query.js";
import { SignInUseCase } from "@identity-and-access/use-cases/sign-in/use-case.js";
import { User } from "@identity-and-access/domain/user/aggregate-root.js";

describe("SignInUseCase", () => {
  const repository = new InMemoryUserRepository();
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

    repository.users.push(User.create({ credentials }));

    // Act
    const output = await useCase.execute(query);

    // Assert
    expect(output).toEqual({
      accessToken: "",
      refreshToken: "",
    });
  });
});
