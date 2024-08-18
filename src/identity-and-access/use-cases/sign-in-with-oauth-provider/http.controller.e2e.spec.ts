import { describe, expect, it } from "vitest";

describe("SignInWithOAuthProviderUseCase", () => {
  it.each`
    provider    | expectedAuthorizationUrl
    ${"google"} | ${"https://accounts.google.com/v3/signin/identifier"}
  `(
    "should initiate the $provider OAuth flow by redirecting to the IDP's authorization endpoint",
    async ({ provider, expectedAuthorizationUrl }) => {
      // Act
      const response = await fetch(
        `http://localhost:8080/identity-and-access/oauth/${provider}`
      );

      // Assert
      expect(response.redirected).toBe(true);
      expect(response.url).toMatch(expectedAuthorizationUrl);
    }
  );

  describe("when the sign-in with the OAuth provider is successful", () => {
    it("should set the jwt access token in a secure, HTTP-only, SameSite=Strict cookie", async () => {
      // Act
      const response = await fetch(
        "http://localhost:8080/identity-and-access/oauth/google/callback"
      );

      // Assert
      const expectedSetCookie = new RegExp(
        "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.[A-Za-z0-9-_]+.[A-Za-z0-9-_]+; Path=/; HttpOnly; Secure; SameSite=Strict"
      );

      expect(response.headers.get("set-cookie")).toMatch(expectedSetCookie);
    });
  });
});
