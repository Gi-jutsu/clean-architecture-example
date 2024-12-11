import type { ForgotPasswordRequest } from "./aggregate-root.js";

export interface ForgotPasswordRequestRepository {
  hasPendingRequest: (accountId: string) => Promise<boolean>;
  save: (request: ForgotPasswordRequest) => Promise<void>;
}

export const ForgotPasswordRequestRepositoryToken = Symbol(
  "ForgotPasswordRequestRepository"
);
