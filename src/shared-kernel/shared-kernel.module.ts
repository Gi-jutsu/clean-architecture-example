import { createFactoryFromConstructor } from "@core/create-factory-from-constructor.js";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { EventEmitterServiceToken } from "./domain/event-emitter.service.js";
import { OutboxMessageRepositoryToken } from "./domain/outbox-message/repository.js";
import { DatabaseModule } from "./infrastructure/database/database.module.js";
import { HttpLoggerInterceptor } from "./infrastructure/http-logger.interceptor.js";
import { MapErrorToRfc9457HttpException } from "./infrastructure/map-error-to-rfc9457-http-exception.interceptor.js";
import { DrizzleOutboxMessageRepository } from "./infrastructure/repositories/drizzle-outbox-message.repository.js";
import { HealthCheckHttpController } from "./use-cases/health-check/http.controller.js";
import { ProcessOutboxMessagesScheduler } from "./use-cases/process-outbox-messages/scheduler.js";
import { ProcessOutboxMessagesUseCase } from "./use-cases/process-outbox-messages/use-case.js";

const ONE_MINUTE_IN_MILLISECONDS = 60_000;
const MAXIMUM_NUMBER_OF_REQUESTS_PER_MINUTE = 100;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: ONE_MINUTE_IN_MILLISECONDS,
        limit: MAXIMUM_NUMBER_OF_REQUESTS_PER_MINUTE,
      },
    ]),
  ],
  controllers: [HealthCheckHttpController],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MapErrorToRfc9457HttpException,
    },
    {
      provide: OutboxMessageRepositoryToken,
      useClass: DrizzleOutboxMessageRepository,
    },
    {
      provide: EventEmitterServiceToken,
      useValue: (await import("@nestjs/event-emitter")).EventEmitter2,
    },
    {
      provide: ProcessOutboxMessagesScheduler,
      useFactory: createFactoryFromConstructor(ProcessOutboxMessagesScheduler),
      inject: [ProcessOutboxMessagesUseCase],
    },
    {
      provide: ProcessOutboxMessagesUseCase,
      useFactory: createFactoryFromConstructor(ProcessOutboxMessagesUseCase),
      inject: [EventEmitter2, OutboxMessageRepositoryToken],
    },
  ],
  exports: [ConfigService, DatabaseModule, OutboxMessageRepositoryToken],
})
export class SharedKernelModule {}
