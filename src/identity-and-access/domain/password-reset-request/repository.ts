import type { PasswordResetRequest } from "./aggregate-root.js";

export interface PasswordResetRequestRepository {
  hasPendingRequest: (accountId: string) => Promise<boolean>;
  save: (request: PasswordResetRequest) => Promise<void>;
}

export const PasswordResetRequestRepositoryToken = Symbol(
  "PasswordResetRequestRepository"
);
