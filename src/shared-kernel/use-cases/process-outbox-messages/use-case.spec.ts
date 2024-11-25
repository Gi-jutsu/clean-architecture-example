import type { EventEmitterService } from "@shared-kernel/domain/event-emitter.service.js";
import { InMemoryOutboxMessageRepository } from "@shared-kernel/infrastructure/repositories/in-memory-outbox-message.repository.js";
import { DateTime, Settings } from "luxon";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { ProcessOutboxMessagesUseCase } from "./use-case.js";

class MockEventEmitterService implements EventEmitterService {
  emittedEvents: { event: string; values: any[] }[] = [];

  async emitAsync(event: string, ...values: any[]): Promise<void> {
    this.emittedEvents.push({ event, values });
  }

  clear() {
    console.log("clearing emitted events");
    this.emittedEvents = [];
  }
}

describe("ProcessOutboxMessagesUseCase", () => {
  const eventEmitter = new MockEventEmitterService();
  const repository = new InMemoryOutboxMessageRepository();
  const useCase = new ProcessOutboxMessagesUseCase(eventEmitter, repository);

  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  afterEach(() => {
    eventEmitter.clear();
    repository.snapshots.clear();
  });

  it("should process outbox messages", async () => {
    // Given
    const unprocessedMessage = {
      id: "1",
      errorMessage: null,
      eventType: "event-a",
      payload: {},
      processedAt: null,
    };

    repository.snapshots.set(unprocessedMessage.id, unprocessedMessage);

    // When
    await useCase.execute();

    // Then
    expect([...repository.snapshots.values()]).toEqual([
      {
        id: unprocessedMessage.id,
        errorMessage: null,
        eventType: unprocessedMessage.eventType,
        payload: unprocessedMessage.payload,
        processedAt: DateTime.now().toJSDate(),
      },
    ]);
  });

  it("should emit an event when a message is processed", async () => {
    // Given
    const unprocessedMessage = {
      id: "1",
      errorMessage: null,
      eventType: "event-b",
      payload: {},
      processedAt: null,
    };

    repository.snapshots.set(unprocessedMessage.id, unprocessedMessage);

    // When
    await useCase.execute();

    // Then
    console.log(eventEmitter.emittedEvents);
    expect(eventEmitter.emittedEvents).toEqual([
      {
        event: "event-b",
        values: [unprocessedMessage.payload],
      },
    ]);
  });
});
