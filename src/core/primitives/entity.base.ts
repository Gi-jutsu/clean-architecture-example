import { randomUUID } from "node:crypto";

interface EntityProperties {
  id: string;
}

interface CreateEntityProperties<
  Properties extends Record<keyof Properties, unknown>
> {
  id?: EntityProperties["id"];
  properties: Properties;
}

export abstract class Entity<
  Properties extends Record<keyof Properties, unknown>
> {
  public readonly id: EntityProperties["id"];
  protected readonly _properties: Properties;

  constructor({ id, properties }: CreateEntityProperties<Properties>) {
    this.id = id ?? randomUUID();
    this._properties = properties;
  }

  static hydrate<Constructor extends new (...args: any) => any>(
    this: Constructor,
    ...args: ConstructorParameters<Constructor>
  ): InstanceType<Constructor> {
    return new this(...args);
  }

  get properties() {
    return Object.freeze({
      id: this.id,
      ...this._properties,
    });
  }
}
