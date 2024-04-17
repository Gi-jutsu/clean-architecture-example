import type { CodeReviewRequest } from "./aggregate-root.js";

export interface CodeReviewRequestRepository {
  save(request: CodeReviewRequest): Promise<void>;
}
