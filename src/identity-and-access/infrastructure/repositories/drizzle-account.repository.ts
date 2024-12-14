import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import {
  accountSchema,
  type IdentityAndAccessDatabase,
} from "@identity-and-access/infrastructure/drizzle/schema.js";
import { Inject, Injectable } from "@nestjs/common";
import { DrizzlePostgresPoolToken } from "@shared-kernel/infrastructure/drizzle/constants.js";
import { count, eq } from "drizzle-orm";

@Injectable()
export class DrizzleAccountRepository implements AccountRepository {
  constructor(
    @Inject(DrizzlePostgresPoolToken)
    private readonly database: IdentityAndAccessDatabase
  ) {}

  async findByEmail(email: string) {
    const [account] = await this.database
      .select()
      .from(accountSchema)
      .where(eq(accountSchema.email, email))
      .limit(1);

    if (!account) return null;

    return Account.fromSnapshot({
      email: account.email,
      id: account.id,
      password: account.password,
    });
  }

  async isEmailTaken(email: string) {
    const [record] = await this.database
      .select({
        count: count(),
      })
      .from(accountSchema)
      .where(eq(accountSchema.email, email))
      .limit(1);

    return record.count > 0;
  }

  async save(account: Account) {
    const snapshot = account.snapshot();

    await this.database
      .insert(accountSchema)
      .values(snapshot)
      .onConflictDoUpdate({
        target: [accountSchema.id],
        set: snapshot,
      });
  }
}
