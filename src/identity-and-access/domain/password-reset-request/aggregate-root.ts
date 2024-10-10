import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";

interface Properties {
  accountId: string;
  token: string;
  expiresAt: Date;
}

interface CreateProperties {
  accountId: string;
}

export class PasswordResetRequest extends AggregateRoot<Properties> {
  static create(properties: CreateProperties) {
    const expiresInOneDay = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const token = Math.random().toString(36).slice(2);

    return new PasswordResetRequest({
      properties: {
        accountId: properties.accountId,
        token,
        expiresAt: expiresInOneDay,
      },
    });
  }
}
