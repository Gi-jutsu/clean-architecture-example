import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";
import { DateTime } from "luxon";
import { ForgotPasswordRequestedDomainEvent } from "./events/password-reset-requested.domain-event.js";

interface Properties {
  accountId: string;
  token: string;
  expiresAt: DateTime;
}

interface CreateProperties {
  accountId: string;
}

export class ForgotPasswordRequest extends AggregateRoot<Properties> {
  static create(properties: CreateProperties) {
    const token = Math.random().toString(36).slice(2);
    const forgotPasswordRequest = new ForgotPasswordRequest({
      properties: {
        accountId: properties.accountId,
        token,
        expiresAt: DateTime.now().plus({ days: 1 }),
      },
    });

    forgotPasswordRequest.commit(
      new ForgotPasswordRequestedDomainEvent({
        payload: forgotPasswordRequest.properties,
      })
    );

    return forgotPasswordRequest;
  }
}