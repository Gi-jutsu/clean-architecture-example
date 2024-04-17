import { CodeReviewRequest } from "../../domain/code-review-request/aggregate-root.js";
import type { CodeReviewRequestRepository } from "../../domain/code-review-request/repository.js";
import type { AskForCodeReviewCommand } from "./command.js";

export class AskForCodeReview {
  constructor(private readonly repository: CodeReviewRequestRepository) {}

  async execute(command: AskForCodeReviewCommand): Promise<void> {
    const request = CodeReviewRequest.create({
      tags: command.tags,
    });

    await this.repository.save(request);
  }
}
