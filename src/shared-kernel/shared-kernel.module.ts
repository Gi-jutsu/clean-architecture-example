import { createFactoryForUseCase } from "@core/use-case.factory.js";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import {
  createEventEmitterService,
  EventEmitterServiceToken,
} from "./domain/event-emitter.service.js";
import { OutboxMessageRepositoryToken } from "./domain/outbox-message/repository.js";
import { DatabaseModule } from "./infrastructure/database/database.module.js";
import { MapErrorToRfc9457HttpException } from "./infrastructure/map-error-to-rfc9457-http-exception.interceptor.js";
import { DrizzleOutboxMessageRepository } from "./infrastructure/repositories/drizzle-outbox-message.repository.js";
import { HealthCheckHttpController } from "./use-cases/health-check/http.controller.js";
import { ProcessOutboxMessagesUseCase } from "./use-cases/process-outbox-messages/use-case.js";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [HealthCheckHttpController],
  providers: [
    ConfigService,
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
      useValue: createEventEmitterService(),
    },
    {
      provide: ProcessOutboxMessagesUseCase,
      useFactory: createFactoryForUseCase(ProcessOutboxMessagesUseCase),
      inject: [OutboxMessageRepositoryToken],
    },
  ],
  exports: [ConfigService, DatabaseModule, OutboxMessageRepositoryToken],
})
export class SharedKernelModule {}
