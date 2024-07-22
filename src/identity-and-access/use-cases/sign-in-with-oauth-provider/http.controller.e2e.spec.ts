import { describe, expect, it } from "vitest";

describe("SignInWithOAuthProviderUseCase", () => {
  it.each`
    provider    | expectedRedirectUrl
    ${"google"} | ${"https://accounts.google.com/v3/signin/identifier"}
  `(
    "should initiate the $provider OAuth flow by redirecting to the IDP's authorization endpoint",
    async ({ provider, expectedRedirectUrl }) => {
      // Act
      const response = await fetch(
        `http://localhost:8080/identity-and-access/oauth/${provider}`
      );

      // Assert
      expect(response.redirected).toBe(true);
      expect(response.url).toMatch(expectedRedirectUrl);
    }
  );
});
