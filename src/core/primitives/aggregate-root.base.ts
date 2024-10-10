import { randomUUID } from "node:crypto";

interface AggregateRootProperties {
  id: string;
}

interface CreateAggregateRootProperties<
  Properties extends Record<keyof Properties, unknown>
> {
  id?: AggregateRootProperties["id"];
  properties: Properties;
}

export abstract class AggregateRoot<
  Properties extends Record<keyof Properties, unknown>
> {
  public readonly id: AggregateRootProperties["id"];
  private readonly _properties: Properties;

  constructor({ id, properties }: CreateAggregateRootProperties<Properties>) {
    this.id = id ?? randomUUID();
    this._properties = properties;
  }

  static hydrate<Constructor extends new (...args: any) => any>(
    this: Constructor,
    ...args: any
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
