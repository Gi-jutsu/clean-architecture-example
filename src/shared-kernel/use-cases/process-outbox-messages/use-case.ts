import type { EventEmitterService } from "@shared-kernel/domain/event-emitter.service.js";
import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";

export class ProcessOutboxMessagesUseCase {
  constructor(
    private readonly allDomainEvents: EventEmitterService,
    private readonly outboxMessages: OutboxMessageRepository
  ) {}

  async execute() {
    const messages = await this.outboxMessages.findUnprocessedMessages();

    for (const message of messages) {
      const { eventType, payload } = message.properties;
      await this.allDomainEvents.emitAsync(eventType, payload);

      message.process();

      await this.outboxMessages.save([message]);
    }
  }
}
