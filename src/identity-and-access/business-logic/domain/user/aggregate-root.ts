interface UserProperties {
  id: string;
  email: string;
  password: string;
}

interface CreateUserProperties {
  email: string;
  password: string;
}

export class User {
  constructor(
    public readonly id: UserProperties["id"],
    public readonly email: UserProperties["email"],
    public readonly password: UserProperties["password"]
  ) {}

  static create(properties: CreateUserProperties) {
    return new User("fake-id", properties.email, properties.password);
  }
}
