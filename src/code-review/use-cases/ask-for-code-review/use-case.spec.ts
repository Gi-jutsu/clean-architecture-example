import { describe, expect, it } from "vitest";
import { AskForCodeReview } from "./use-case.js";
import { AskForCodeReviewCommand } from "./command.js";
import { CodeReviewRequest } from "../../domain/code-review-request/aggregate-root.js";
import { InMemoryCodeReviewRequestRepository } from "../../infrastructure/repositories/in-memory/in-memory-code-review-request.repository.js";

describe("AskForCodeReview", () => {
  it("should create a new CodeReviewRequest", () => {
    // Arrange
    const allCodeReviewRequests = new InMemoryCodeReviewRequestRepository();
    const useCase = new AskForCodeReview(allCodeReviewRequests);

    const command = new AskForCodeReviewCommand({
      tags: ["NodeJS", "Typescript", "Clean Architecture"],
    });

    // Act
    useCase.execute(command);

    // Assert
    expect(allCodeReviewRequests.records).toEqual([
      CodeReviewRequest.hydrate({
        id: expect.any(String),
        tags: ["NodeJS", "Typescript", "Clean Architecture"],
      }),
    ]);
  });
});
