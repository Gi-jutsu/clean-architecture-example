import type { EventEmitterService } from "@shared-kernel/domain/event-emitter.service.js";
import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";

export class ProcessOutboxMessagesUseCase {
  constructor(
    private readonly allDomainEvents: EventEmitterService,
    private readonly allOutboxMessages: OutboxMessageRepository
  ) {}

  async execute() {
    const messages = await this.allOutboxMessages.findUnprocessedMessages();

    for (const message of messages) {
      const { eventType, payload } = message.properties;

      try {
        await this.allDomainEvents.emitAsync(eventType, payload);
        message.process();
      } catch (error) {
        message.fail(error.message);
      }

      await this.allOutboxMessages.save([message]);
    }
  }
}
