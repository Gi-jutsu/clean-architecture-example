import type { Account } from "./aggregate-root.js";

export interface AccountRepository {
  findByEmail(email: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}

export const AccountRepositoryToken = Symbol("AccountRepository");
