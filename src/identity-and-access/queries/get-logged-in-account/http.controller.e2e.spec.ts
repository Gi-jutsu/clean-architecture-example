import { Server } from "http";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { bootstrap } from "../../../main.js";

describe("GetLoggedInAccountHttpController", () => {
  let server: Server;

  beforeAll(async () => {
    server = await bootstrap();
  });

  afterAll(async () => {
    server.close();
  });

  describe("GET /auth/me", () => {
    // @TODO: To be implemented (when authentication guard is ready)
    it.skip("should return 200 with the logged in account", async () => {
      const response = await supertest(server)
        .post("/auth/forgot-password")
        .send({ email: "dylan@call-me-dev.com" });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: "52afc7a5-f0e7-4477-b5c7-249ef34099a1",
        email: "dylan@call-me-dev.com",
      });
    });
  });
});
