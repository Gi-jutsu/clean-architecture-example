import { sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const accountSchema = pgTable(
  "accounts",
  {
    id: uuid("id")
      .$defaultFn(() => randomUUID())
      .primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(
      sql`lower(${table.email})`
    ),
  })
);

export type IdentityAndAccessDatabaseSchema = NodePgDatabase<{
  accounts: typeof accountSchema;
}>;
