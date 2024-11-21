import type { OutboxMessage } from "@shared-kernel/domain/outbox-message/aggregate-root.js";
import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";

export class InMemoryOutboxMessageRepository
  implements OutboxMessageRepository
{
  readonly snapshots = new Map();

  async save(messages: OutboxMessage[]) {
    for (const message of messages) {
      this.snapshots.set(message.id, message.properties);
    }
  }
}
