import { DomainEvent } from "@core/primitives/domain-event.base.js";
import { DateTime } from "luxon";

export class ForgotPasswordRequestedDomainEvent extends DomainEvent<{
  accountId: string;
  expiresAt: DateTime;
  token: string;
}> {}
