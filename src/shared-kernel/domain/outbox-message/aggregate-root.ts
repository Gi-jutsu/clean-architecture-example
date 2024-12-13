import type { DomainEvent } from "@core/primitives/domain-event.base.js";
import { Entity } from "@core/primitives/entity.base.js";
import { DateTime } from "luxon";

interface Properties {
  eventType: string;
  payload: Record<string, unknown>;
  processedAt: Date | null;
  errorMessage: string | null;
}

export class OutboxMessage extends Entity<Properties> {
  static fromDomainEvent(event: DomainEvent) {
    return new OutboxMessage({
      properties: {
        eventType: event.type,
        payload: event.payload,
        processedAt: null,
        errorMessage: null,
      },
    });
  }

  fail(errorMessage: string) {
    this._properties.errorMessage = errorMessage;
    this._properties.processedAt = DateTime.now().toJSDate();
  }

  process() {
    this._properties.processedAt = DateTime.now().toJSDate();
  }
}
