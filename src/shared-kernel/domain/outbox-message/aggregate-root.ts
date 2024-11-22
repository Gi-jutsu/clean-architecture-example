import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";
import type { DomainEvent } from "@core/primitives/domain-event.base.js";
import { DateTime } from "luxon";

interface Properties {
  eventType: string;
  payload: Record<string, unknown>;
  processedAt: Date | null;
  errorMessage: string | null;
}

// @TODO: Bad Design, consider splitting AggregateRoot into two classes: AggregateRoot, Entity
export class OutboxMessage extends AggregateRoot<Properties> {
  static createFromDomainEvent(event: DomainEvent) {
    return new OutboxMessage({
      properties: {
        eventType: event.type,
        payload: event.payload,
        processedAt: null,
        errorMessage: null,
      },
    });
  }

  process() {
    this._properties.processedAt = DateTime.now().toJSDate();
  }
}
