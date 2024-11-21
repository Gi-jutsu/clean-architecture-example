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

export const passwordResetRequestSchema = pgTable(
  "password_reset_requests",
  {
    id: uuid("id")
      .$defaultFn(() => randomUUID())
      .primaryKey(),
    accountId: uuid("account_id").references(() => accountSchema.id),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    uniqueAccountResetRequest: uniqueIndex("uniqueAccountResetRequest").on(
      table.accountId
    ),
  })
);

export type IdentityAndAccessDatabase = NodePgDatabase<{
  accounts: typeof accountSchema;
}>;
