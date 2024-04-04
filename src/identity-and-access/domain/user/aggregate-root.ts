interface UserProperties {
  id: string;
  credentials: {
    email: string;
    password: string;
  };
}

interface CreateUserProperties {
  credentials: UserProperties["credentials"];
}

export class User {
  constructor(
    public readonly id: UserProperties["id"],
    public readonly credentials: UserProperties["credentials"]
  ) {}

  static create(properties: CreateUserProperties) {
    return new User("fake-id", properties.credentials);
  }
}
