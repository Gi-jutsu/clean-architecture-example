import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";
import type { DomainEvent } from "@core/primitives/domain-event.base.js";

interface Properties {
  payload: Record<string, unknown>;
  type: string;
}

export class OutboxMessage extends AggregateRoot<Properties> {
  static createFromDomainEvent(event: DomainEvent) {
    return new OutboxMessage({
      properties: {
        payload: event.payload,
        type: event.type,
      },
    });
  }
}
