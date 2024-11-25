type ClassConstructor<T = any> = new (...args: any[]) => T;

export function createFactoryFromConstructor<T extends ClassConstructor>(
  constructor: ClassConstructor
) {
  return (...args: ConstructorParameters<T>): InstanceType<T> =>
    new constructor(...args);
}
