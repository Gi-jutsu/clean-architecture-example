export interface EventEmitterService {
  emitAsync(event: string, ...values: any[]): Promise<void>;
}

export const EventEmitterServiceToken = Symbol("EventEmitterService");

export const createEventEmitterService = async () =>
  (await import("@nestjs/event-emitter")).EventEmitter2;
