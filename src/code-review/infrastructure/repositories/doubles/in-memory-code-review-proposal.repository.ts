import { CodeReviewProposal } from "../../../domain/code-review-proposal/aggregate-root.js";
import type { CodeReviewProposalRepository } from "../../../domain/code-review-proposal/repository.js";

export class InMemoryCodeReviewProposalRepository
  implements CodeReviewProposalRepository
{
  public readonly proposals: CodeReviewProposal[] = [];

  save(proposals: CodeReviewProposal): Promise<void> {
    this.proposals.push(proposals);
    return Promise.resolve();
  }
}
