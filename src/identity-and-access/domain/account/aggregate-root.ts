import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";
import { NewAccountRegisteredDomainEvent } from "./events/new-account-registered.js";

interface Properties {
  email: string;
  password: string;
}

export class Account extends AggregateRoot<Properties> {
  static create(properties: Properties) {
    const account = new Account({ properties });

    account.commit(
      new NewAccountRegisteredDomainEvent({
        aggregateId: account.id,
        payload: account.properties,
      })
    );

    return account;
  }
}
