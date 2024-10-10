import { AggregateRoot } from "@core/primitives/aggregate-root.base.js";

interface Properties {
  email: string;
  password: string;
}

export class Account extends AggregateRoot<Properties> {
  static create(properties: Properties) {
    return new Account({ properties });
  }
}
