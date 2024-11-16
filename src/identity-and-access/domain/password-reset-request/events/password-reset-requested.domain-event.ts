import { DomainEvent } from "@core/primitives/domain-event.base.js";
import { DateTime } from "luxon";

export class PasswordResetRequestedDomainEvent extends DomainEvent<{
  accountId: string;
  expiresAt: DateTime;
  token: string;
}> {}
