import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";
import { DateTime } from "luxon";
import { PasswordResetRequestedDomainEvent } from "./events/password-reset-requested.domain-event.js";

interface Properties {
  accountId: string;
  token: string;
  expiresAt: DateTime;
}

interface CreateProperties {
  accountId: string;
}

export class PasswordResetRequest extends AggregateRoot<Properties> {
  static create(properties: CreateProperties) {
    const token = Math.random().toString(36).slice(2);
    const passwordResetRequest = new PasswordResetRequest({
      properties: {
        accountId: properties.accountId,
        token,
        expiresAt: DateTime.now().plus({ days: 1 }),
      },
    });

    passwordResetRequest.commit(
      new PasswordResetRequestedDomainEvent({
        aggregateId: passwordResetRequest.id,
        payload: passwordResetRequest.properties,
      })
    );

    return passwordResetRequest;
  }
}
