import { Inject, Injectable } from "@nestjs/common";
import type { OutboxMessage } from "@shared-kernel/domain/outbox-message/aggregate-root.js";
import type { OutboxMessageRepository } from "@shared-kernel/domain/outbox-message/repository.js";
import { DrizzlePostgresPoolToken } from "../database/drizzle/constants.js";
import {
  outboxMessageSchema,
  SharedKernelDatabase,
} from "../database/drizzle/schema.js";

@Injectable()
export class DrizzleOutboxMessageRepository implements OutboxMessageRepository {
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: SharedKernelDatabase
  ) {}

  async save(messages: OutboxMessage[]) {
    const snapshots = messages.map((message) => message.properties);

    await this.database
      .insert(outboxMessageSchema)
      .values(snapshots)
      .onConflictDoNothing();
  }
}
