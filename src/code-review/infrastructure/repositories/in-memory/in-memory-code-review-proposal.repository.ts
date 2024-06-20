import { CodeReviewProposal } from "../../../domain/code-review-proposal/aggregate-root.js";
import type { CodeReviewProposalRepository } from "../../../domain/code-review-proposal/repository.js";

export class InMemoryCodeReviewProposalRepository
  implements CodeReviewProposalRepository
{
  public readonly records: CodeReviewProposal[] = [];

  save(proposal: CodeReviewProposal): Promise<void> {
    this.records.push(proposal);
    return Promise.resolve();
  }
}
