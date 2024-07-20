import { describe, expect, it } from "vitest";

describe("GET /health-check", () => {
  it("should return 200 when the api is healthy", async () => {
    // Act
    const response = await fetch("http://localhost:8080/health-check");

    // Assert
    expect(response.status).toBe(200);
  });
});
