import { DomainEvent } from "./domain-event.base.js";
import { Entity } from "./entity.base.js";

export abstract class AggregateRoot<
  Properties extends Record<keyof Properties, unknown>
> extends Entity<Properties> {
  // @TODO: Benchmark the performance on high-scale events (consider using a queue)
  private readonly _events: DomainEvent[] = [];

  protected commit(event: DomainEvent) {
    this._events.push(event);
  }

  get properties() {
    return Object.freeze({
      id: this.id,
      ...this._properties,
    });
  }

  pullDomainEvents() {
    const events = [...this._events];
    this._events.length = 0;

    return events;
  }
}
