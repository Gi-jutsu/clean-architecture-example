import { DomainEvent } from "@core/primitives/domain-event.base.js";

export class NewAccountRegisteredDomainEvent extends DomainEvent<{
  email: string;
}> {}
