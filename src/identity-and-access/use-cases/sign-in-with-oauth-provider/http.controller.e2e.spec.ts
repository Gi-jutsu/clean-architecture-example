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

  describe("when the sign-in with the OAuth provider is successful", () => {
    it("should set an HTTP-only cookie with the access token", async () => {
      // Act
      const response = await fetch(
        "http://localhost:8080/identity-and-access/oauth/google/callback"
      );

      // Assert
      const setCookieRegex = new RegExp(
        "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[A-Za-z0-9-_]+.[A-Za-z0-9-_]+; Path=/; HttpOnly"
      );

      expect(response.headers.get("set-cookie")).toMatch(setCookieRegex);
    });
  });
});
