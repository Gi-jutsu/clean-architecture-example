import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";

interface AccountProperties {
  email: string;
  password: string;
}

export class Account extends AggregateRoot<AccountProperties> {
  static create(properties: AccountProperties) {
    return new Account({ properties });
  }

  static hydrate(...args: ConstructorParameters<typeof Account>) {
    return new Account(...args);
  }
}
