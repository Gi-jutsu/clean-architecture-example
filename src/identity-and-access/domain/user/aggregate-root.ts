import { AggregateRoot } from "@shared-kernel/domain/aggregate-root.base.js";

interface UserProperties {
  credentials: {
    email: string;
    password: string;
  };
}

interface CreateUserProperties {
  credentials: UserProperties["credentials"];
}

export class User extends AggregateRoot<UserProperties> {
  static create(properties: CreateUserProperties) {
    return new User({ properties });
  }

  static hydrate({
    id,
    ...properties
  }: AggregateRoot<UserProperties>["properties"]) {
    return new User({ id, properties });
  }

  get credentials() {
    return this.properties.credentials;
  }
}
