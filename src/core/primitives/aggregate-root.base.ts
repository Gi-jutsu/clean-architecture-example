import { randomUUID } from "node:crypto";
import { DomainEvent } from "./domain-event.base.js";

interface AggregateRootProperties {
  id: string;
}

interface CreateAggregateRootProperties<
  Properties extends Record<keyof Properties, unknown>
> {
  id?: AggregateRootProperties["id"];
  properties: Properties;
}

export abstract class AggregateRoot<
  Properties extends Record<keyof Properties, unknown>
> {
  public readonly id: AggregateRootProperties["id"];
  private readonly _properties: Properties;
  // @TODO: Benchmark the performance on high-scale events (consider using a queue)
  private readonly _domainEvents: DomainEvent[] = [];

  constructor({ id, properties }: CreateAggregateRootProperties<Properties>) {
    this.id = id ?? randomUUID();
    this._properties = properties;
  }

  static hydrate<Constructor extends new (...args: any) => any>(
    this: Constructor,
    ...args: any
  ): InstanceType<Constructor> {
    return new this(...args);
  }

  protected commit(event: DomainEvent) {
    this._domainEvents.push(event);
  }

  private clearDomainEvents() {
    this._domainEvents.length = 0;
  }

  get properties() {
    return Object.freeze({
      id: this.id,
      ...this._properties,
    });
  }

  pullDomainEvents() {
    const domainEvents = [...this._domainEvents];
    this.clearDomainEvents();
    return domainEvents;
  }
}
