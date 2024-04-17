import { AggregateRoot } from "../../../shared-kernel/domain/aggregate-root.base.js";

interface CodeReviewRequestProperties {
  tags: string[];
}

interface CreateUserProperties {
  tags: CodeReviewRequestProperties["tags"];
}

export class CodeReviewRequest extends AggregateRoot<CodeReviewRequestProperties> {
  static create(properties: CreateUserProperties) {
    return new CodeReviewRequest({ properties });
  }

  static hydrate({
    id,
    ...properties
  }: AggregateRoot<CodeReviewRequestProperties>["properties"]) {
    return new CodeReviewRequest({ id, properties });
  }
}
