import { CodeReviewProposal } from "../../domain/code-review-proposal/aggregate-root.js";
import { CodeReviewProposalRepository } from "../../domain/code-review-proposal/repository.js";
import type { SubmitCodeReviewProposalCommand } from "./command.js";

export class SubmitCodeReviewProposalUseCase {
  constructor(private readonly repository: CodeReviewProposalRepository) {}

  async execute(command: SubmitCodeReviewProposalCommand) {
    const proposal = CodeReviewProposal.create({
      link: command.link,
    });

    await this.repository.save(proposal);
  }
}
