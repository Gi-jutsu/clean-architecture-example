import { describe, expect, it } from "vitest";
import { AskForCodeReviewUseCase } from "./use-case.js";
import { AskForCodeReviewCommand } from "./command.js";
import { CodeReviewRequest } from "../../domain/code-review-request/aggregate-root.js";
import { InMemoryCodeReviewRequestRepository } from "../../infrastructure/repositories/doubles/in-memory-code-review-request.repository.js";

describe("AskForCodeReviewUseCase", () => {
  it("should create a new CodeReviewRequest", () => {
    // Arrange
    const repository = new InMemoryCodeReviewRequestRepository();
    const useCase = new AskForCodeReviewUseCase(repository);

    const command = new AskForCodeReviewCommand({
      tags: ["NodeJS", "Typescript", "Clean Architecture"],
    });

    // Act
    useCase.execute(command);

    // Assert
    expect(repository.requests).toEqual([
      CodeReviewRequest.hydrate({
        id: expect.any(String),
        tags: ["NodeJS", "Typescript", "Clean Architecture"],
      }),
    ]);
  });
});
