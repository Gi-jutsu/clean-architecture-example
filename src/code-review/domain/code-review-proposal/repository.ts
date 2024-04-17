import type { CodeReviewProposal } from "./aggregate-root.js";

export interface CodeReviewProposalRepository {
  save(request: CodeReviewProposal): Promise<void>;
}
