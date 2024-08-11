import { describe, expect, it } from "vitest";
import { SignInWithOAuthProviderUseCase } from "./use-case.js";

describe("SignInWithOAuthProviderUseCase", () => {
  const fakeJwtService = { sign: () => "fakeJwtToken" };
  const useCase = new SignInWithOAuthProviderUseCase(fakeJwtService);

  it("should return access and refresh tokens", async () => {
    // Act
    const output = await useCase.execute({
      code: "code",
      provider: "google",
    });

    // Assert
    expect(output).toEqual({
      accessToken: "fakeJwtToken",
    });
  });
});
