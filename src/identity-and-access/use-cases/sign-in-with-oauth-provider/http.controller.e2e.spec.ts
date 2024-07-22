import { describe, expect, it } from "vitest";

describe("SignInWithOAuthProviderUseCase", () => {
  it("should initiate the OAuth flow by redirecting to the IDP's authorization endpoint", async () => {
    // Act
    const response = await fetch(
      "http://localhost:8080/identity-and-access/oauth/google"
    );

    // Assert
    expect(response.redirected).toBe(true);
    expect(response.url).toMatch(
      "https://accounts.google.com/v3/signin/identifier"
    );
  });
});
