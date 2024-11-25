export interface EventEmitterService {
  emitAsync(event: string, ...values: any[]): Promise<void>;
}

export const EventEmitterServiceToken = Symbol("EventEmitterService");
