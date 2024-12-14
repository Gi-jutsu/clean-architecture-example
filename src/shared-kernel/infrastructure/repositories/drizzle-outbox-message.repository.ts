import { Inject, Injectable } from "@nestjs/common";
import { OutboxMessage } from "@shared-kernel/domain/outbox-message/aggregate-root.js";
import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/drizzle/constants.js";
import {
  outboxMessageSchema,
  type SharedKernelDatabase,
} from "@shared-kernel/infrastructure/drizzle/schema.js";
import { and, isNull, lte, sql } from "drizzle-orm";
import { DateTime } from "luxon";

@Injectable()
export class DrizzleOutboxMessageRepository implements OutboxMessageRepository {
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: SharedKernelDatabase
  ) {}

  async findUnprocessedMessages() {
    const snapshots = await this.database
      .select()
      .from(outboxMessageSchema)
      .where(
        and(
          lte(outboxMessageSchema.occurredAt, DateTime.now().toJSDate()),
          isNull(outboxMessageSchema.processedAt)
        )
      );

    return snapshots.map((s) => OutboxMessage.fromSnapshot(s));
  }

  async save(messages: OutboxMessage[]) {
    const snapshots = messages.map((message) => message.snapshot());

    await this.database
      .insert(outboxMessageSchema)
      .values(snapshots)
      .onConflictDoUpdate({
        target: outboxMessageSchema.id,
        set: {
          processedAt: sql`NOW()`,
        },
      });
  }
}
