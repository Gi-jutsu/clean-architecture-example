export class AskForCodeReviewCommand {
  public readonly tags: string[];

  constructor(input: AskForCodeReviewCommand) {
    this.tags = input.tags;
  }
}
