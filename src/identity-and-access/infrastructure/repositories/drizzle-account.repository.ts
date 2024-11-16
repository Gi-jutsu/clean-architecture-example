import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import {
  accountSchema,
  type IdentityAndAccessDatabaseSchema,
} from "@identity-and-access/infrastructure/database/drizzle/schema.js";
import { Inject, Injectable } from "@nestjs/common";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/database/drizzle/constants.js";
import { count, eq } from "drizzle-orm";

@Injectable()
export class DrizzleAccountRepository implements AccountRepository {
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: IdentityAndAccessDatabaseSchema
  ) {}

  async findByEmail(email: string) {
    const [account] = await this.database
      .select()
      .from(accountSchema)
      .where(eq(accountSchema.email, email))
      .limit(1);

    if (!account) return null;

    return Account.hydrate({
      properties: account,
      id: account.id,
    });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const [record] = await this.database
      .select({
        count: count(),
      })
      .from(accountSchema)
      .where(eq(accountSchema.email, email))
      .limit(1);

    return record.count > 0;
  }

  async save(account: Account): Promise<void> {
    await this.database
      .insert(accountSchema)
      .values(account.properties)
      .onConflictDoUpdate({
        target: [accountSchema.id],
        set: account.properties,
      });
  }
}
