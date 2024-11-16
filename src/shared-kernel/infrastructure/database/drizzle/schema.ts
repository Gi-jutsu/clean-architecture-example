import type { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const OutboxEventSchema = pgTable("outbox_events", {
  id: uuid("id")
    .$defaultFn(() => randomUUID())
    .primaryKey(),

  eventName: text("event_name").notNull(),
  eventPayload: jsonb("event_payload")
    .notNull()
    .$type<Record<string, unknown>>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$defaultFn(() => new Date()),
});

export type SharedKernelDatabase = NodePgDatabase<{
  outboxEvents: typeof OutboxEventSchema;
}>;

export type SharedKernelDatabaseTransactionAdapter =
  TransactionalAdapterDrizzleOrm<SharedKernelDatabase>;
