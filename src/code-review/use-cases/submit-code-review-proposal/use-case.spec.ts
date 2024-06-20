import { describe, expect, it } from "vitest";
import { InMemoryCodeReviewProposalRepository } from "../../infrastructure/repositories/in-memory/in-memory-code-review-proposal.repository.js";
import { SubmitCodeReviewProposalCommand } from "./command.js";
import { SubmitCodeReviewProposalUseCase } from "./use-case.js";
import { CodeReviewProposal } from "../../domain/code-review-proposal/aggregate-root.js";

describe("SubmitCodeReviewProposalUseCase", () => {
  it("should successfully submit a code review proposal", async () => {
    // Arrange
    const allCodeReviewProposals = new InMemoryCodeReviewProposalRepository();
    const useCase = new SubmitCodeReviewProposalUseCase(allCodeReviewProposals);

    const command = new SubmitCodeReviewProposalCommand({
      link: "https://github.com",
    });

    // Act
    await useCase.execute(command);

    // Assert
    expect(allCodeReviewProposals.records).toEqual([
      CodeReviewProposal.hydrate({
        id: expect.any(String),
        link: "https://github.com",
      }),
    ]);
  });
});
