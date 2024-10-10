import type { PasswordResetRequest } from "./aggregate-root.js";

export interface PasswordResetRequestRepository {
  save: (request: PasswordResetRequest) => Promise<void>;
}

export const PasswordResetRequestRepositoryToken = Symbol(
  "PasswordResetRequestRepository"
);
