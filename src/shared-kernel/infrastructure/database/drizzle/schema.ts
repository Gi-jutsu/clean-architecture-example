import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const outboxMessageSchema = pgTable("outbox_messages", {
  id: uuid("id")
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),
  type: varchar("type", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$defaultFn(() => new Date()),
});

export type SharedKernelDatabase = NodePgDatabase<{
  outboxMessages: typeof outboxMessageSchema;
}>;
