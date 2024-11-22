import { InMemoryOutboxMessageRepository } from "@shared-kernel/infrastructure/repositories/in-memory-outbox-message.repository.js";
import { DateTime, Settings } from "luxon";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ProcessOutboxMessagesUseCase } from "./use-case.js";

describe("ProcessOutboxMessagesUseCase", () => {
  const repository = new InMemoryOutboxMessageRepository();
  const useCase = new ProcessOutboxMessagesUseCase(repository);

  beforeAll(() => {
    Settings.now = () => new Date(0).getMilliseconds();
  });

  afterAll(() => {
    Settings.now = () => Date.now();
  });

  it("should process outbox messages", async () => {
    // Given
    const unprocessedMessage = {
      id: "1",
      errorMessage: null,
      eventType: "event",
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
});
