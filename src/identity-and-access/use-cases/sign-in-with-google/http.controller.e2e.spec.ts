import { describe, expect, it } from "vitest";

describe("SignInWithGoogleUseCase", () => {
  it("should redirect to the google authorization URL", async () => {
    // Act
    const response = await fetch(
      `http://localhost:8080/identity-and-access/oauth/google`
    );

    // Assert
    expect(response.redirected).toBe(true);
    expect(response.url).toMatch(
      "https://accounts.google.com/v3/signin/identifier"
    );
  });

  describe("when successfully signed in with Google", () => {
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
