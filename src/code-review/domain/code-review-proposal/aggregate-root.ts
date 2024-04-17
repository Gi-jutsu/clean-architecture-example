import { AggregateRoot } from "../../../shared-kernel/domain/aggregate-root.base.js";

interface CodeReviewProposalProperties {
  link: string;
}

interface CreateCodeReviewProposalProperties {
  link: CodeReviewProposalProperties["link"];
}

export class CodeReviewProposal extends AggregateRoot<CodeReviewProposalProperties> {
  static create(properties: CreateCodeReviewProposalProperties) {
    return new CodeReviewProposal({ properties });
  }

  static hydrate({
    id,
    ...properties
  }: AggregateRoot<CodeReviewProposalProperties>["properties"]) {
    return new CodeReviewProposal({ id, properties });
  }
}
