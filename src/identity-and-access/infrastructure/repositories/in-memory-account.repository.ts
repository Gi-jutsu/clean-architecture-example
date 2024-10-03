import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";

export class InMemoryAccountRepository implements AccountRepository {
  snapshots = new Map();

  async findByEmail(email: string): Promise<Account | null> {
    for (const [id, properties] of this.snapshots.entries()) {
      if (properties.email !== email) continue;

      return Account.hydrate({
        properties,
        id,
      });
    }

    return null;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return Array.from(this.snapshots.values()).some(
      (properties) => properties.email === email
    );
  }

  async save(account: Account): Promise<void> {
    this.snapshots.set(account.id, account.properties);
  }
}
