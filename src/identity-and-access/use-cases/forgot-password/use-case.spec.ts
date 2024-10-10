import { InMemoryAccountRepository } from "@identity-and-access/infrastructure/repositories/in-memory-account.repository.js";
import { describe, expect, it } from "vitest";
import { ForgotPasswordUseCase } from "./use-case.js";

describe("ForgotPasswordUseCase", () => {
  const accounts = new InMemoryAccountRepository();
  const useCase = new ForgotPasswordUseCase(accounts);

  it("should throw an error when attempting to reset password for an unregistered email address", async () => {
    // Given
    const email = "non-registered@call-me-dev.com";

    // When
    const promise = useCase.execute({ email });

    // Then
    await expect(promise).rejects.toMatchObject({
      status: 404,
      code: "resource-not-found",
      title: "Resource Not Found",
      detail: "The Account you are trying to access does not exist.",
      timestamp: expect.any(Date),
      pointer: "/data/attributes/email",
      resource: "Account",
      searchedByFieldName: "email",
      searchedByValue: email,
    });
  });
});
