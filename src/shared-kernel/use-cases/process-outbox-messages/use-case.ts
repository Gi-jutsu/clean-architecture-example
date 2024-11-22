import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";

export class ProcessOutboxMessagesUseCase {
  constructor(private readonly outboxMessages: OutboxMessageRepository) {}

  async execute() {
    const messages = await this.outboxMessages.findUnprocessedMessages();

    for (const message of messages) {
      // @TODO: Emit outbox message as domain event
      message.process();

      await this.outboxMessages.save([message]);
    }
  }
}
