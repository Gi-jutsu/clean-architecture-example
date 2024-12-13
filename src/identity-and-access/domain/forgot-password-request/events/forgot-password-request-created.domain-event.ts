import { DomainEvent } from "@core/primitives/domain-event.base.js";
import type { ForgotPasswordRequest } from "@identity-and-access/domain/forgot-password-request/aggregate-root.js";

export class ForgotPasswordRequestCreatedDomainEvent extends DomainEvent<
  Pick<ForgotPasswordRequest["properties"], "accountId" | "expiresAt" | "token">
> {}
