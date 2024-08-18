import { describe, expect, it } from "vitest";
import { SignInWithGoogleUseCase } from "./use-case.js";

describe("SignInWithGoogleUseCase", () => {
  const fakeJwtService = { sign: () => "fakeJwtToken" };
  const useCase = new SignInWithGoogleUseCase(fakeJwtService);

  it.todo("should exchange the authorization code for an access token");

  it("should return an access token", async () => {
    // Act
    const output = await useCase.execute({
      code: "authorizationCode",
    });

    // Assert
    expect(output).toEqual({
      accessToken: "fakeJwtToken",
    });
  });
});
