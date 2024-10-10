import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";
import { DateTime } from "luxon";

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

    return new PasswordResetRequest({
      properties: {
        accountId: properties.accountId,
        token,
        expiresAt: DateTime.now().plus({ days: 1 }),
      },
    });
  }
}
