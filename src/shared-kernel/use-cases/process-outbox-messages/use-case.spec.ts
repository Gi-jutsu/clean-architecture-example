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
    this.emittedEvents = [];
  }
}

describe("ProcessOutboxMessagesUseCase", () => {
  const eventEmitter = new MockEventEmitterService();
  const allOutboxMessages = new InMemoryOutboxMessageRepository();
  const useCase = new ProcessOutboxMessagesUseCase(
    eventEmitter,
    allOutboxMessages
  );

  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  afterEach(() => {
    eventEmitter.clear();
    allOutboxMessages.snapshots.clear();
  });

  // @TODO: consider batching messages when reaching high number of messages per tick
  it("should process all unprocessed messages", async () => {
    // Given
    const unprocessedMessageA = {
      id: "1",
      errorMessage: null,
      eventType: "event-a",
      payload: {},
      processedAt: null,
    };

    const unprocessedMessageB = {
      id: "2",
      errorMessage: null,
      eventType: "event-b",
      payload: {},
      processedAt: null,
    };

    allOutboxMessages.snapshots.set(
      unprocessedMessageA.id,
      unprocessedMessageA
    );
    allOutboxMessages.snapshots.set(
      unprocessedMessageB.id,
      unprocessedMessageB
    );

    // When
    await useCase.execute();

    // Then
    expect([...allOutboxMessages.snapshots.values()]).toEqual([
      {
        id: unprocessedMessageA.id,
        errorMessage: null,
        eventType: unprocessedMessageA.eventType,
        payload: unprocessedMessageA.payload,
        processedAt: DateTime.now().toJSDate(),
      },
      {
        id: unprocessedMessageB.id,
        errorMessage: null,
        eventType: unprocessedMessageB.eventType,
        payload: unprocessedMessageB.payload,
        processedAt: DateTime.now().toJSDate(),
      },
    ]);
  });

  it("should emit an event when a message is processed", async () => {
    // Given
    const unprocessedMessageC = {
      id: "1",
      errorMessage: null,
      eventType: "event-c",
      payload: {},
      processedAt: null,
    };

    allOutboxMessages.snapshots.set(
      unprocessedMessageC.id,
      unprocessedMessageC
    );

    // When
    await useCase.execute();

    // Then
    expect(eventEmitter.emittedEvents).toEqual([
      {
        event: "event-c",
        values: [unprocessedMessageC.payload],
      },
    ]);
  });
});
