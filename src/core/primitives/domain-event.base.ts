import { randomUUID } from "node:crypto";

interface CreateDomainEventProps<Payload = Record<string, unknown>> {
  aggregateId: string;
  payload: Payload;
}

export abstract class DomainEvent<Payload = Record<string, unknown>> {
  readonly id: string;
  readonly metadata: {
    // @TODO: Implement 'correlationId' in the future
    // correlationId: string;
    emittedByAggregateId: string;
  };
  readonly payload: Payload;

  constructor(properties: CreateDomainEventProps<Payload>) {
    this.id = randomUUID();
    this.metadata = {
      emittedByAggregateId: properties.aggregateId,
    };
    this.payload = properties.payload;
  }
}
