import { describe, expect, it } from "vitest";

describe("ReadMeHttpController", () => {
  it("should return the logged in user", async () => {
    // Arrange
    // Act
    const response = await fetch(
      "http://localhost:8080/identity-and-access/me"
    );

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: "1",
      email: "john.doe@email.com",
    });
  });
});
