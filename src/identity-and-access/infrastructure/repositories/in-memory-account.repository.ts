import { Account } from "@identity-and-access/domain/account/aggregate-root.js";
import type { AccountRepository } from "@identity-and-access/domain/account/repository.js";

/**
 * @TODO: Implement E2E fixtures
 *
 * E2E Global Setup
 * -> Bootstrap a PostgreSQL database
 * -> Run the migrations
 * -> Seed the database with E2E fixtures
 *
 * This is a temporary solution to be able to run the E2E tests.
 */
const E2E_FIXTURES = [
  {
    id: "account-1",
    email: "dylan@call-me-dev.com",
    password: "password",
  },
];

export class InMemoryAccountRepository implements AccountRepository {
  snapshots = new Map(
    E2E_FIXTURES.map(({ id, ...properties }) => [id, properties])
  );

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
