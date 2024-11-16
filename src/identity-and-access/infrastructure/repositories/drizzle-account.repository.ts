import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";
import {
  accountSchema,
  type IdentityAndAccessDatabaseTransactionAdapter,
} from "@identity-and-access/infrastructure/database/drizzle/schema.js";
import { TransactionHost } from "@nestjs-cls/transactional";
import { Injectable } from "@nestjs/common";
import { count, eq } from "drizzle-orm";

@Injectable()
export class DrizzleAccountRepository implements AccountRepository {
  constructor(
    private readonly txHost: TransactionHost<IdentityAndAccessDatabaseTransactionAdapter>
  ) {}

  async findByEmail(email: string) {
    const [account] = await this.txHost.tx
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
    const [record] = await this.txHost.tx
      .select({
        count: count(),
      })
      .from(accountSchema)
      .where(eq(accountSchema.email, email))
      .limit(1);

    return record.count > 0;
  }

  async save(account: Account): Promise<void> {
    await this.txHost.tx
      .insert(accountSchema)
      .values(account.properties)
      .onConflictDoUpdate({
        target: [accountSchema.id],
        set: account.properties,
      });
  }
}
