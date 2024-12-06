import { createFactoryFromConstructor } from "@core/create-factory-from-constructor.js";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { z } from "zod";
import { EventEmitterToken } from "./domain/event-emitter.interface.js";
import { MailerToken } from "./domain/mailer.interface.js";
import { OutboxMessageRepositoryToken } from "./domain/outbox-message/repository.js";
import { ConsoleMailer } from "./infrastructure/console-mailer.adapter.js";
import { DrizzleModule } from "./infrastructure/drizzle/module.js";
import { HttpLoggerInterceptor } from "./infrastructure/http-logger.interceptor.js";
import { MapErrorToRfc9457HttpException } from "./infrastructure/map-error-to-rfc9457-http-exception.interceptor.js";
import { DrizzleOutboxMessageRepository } from "./infrastructure/repositories/drizzle-outbox-message.repository.js";
import { HealthCheckHttpController } from "./use-cases/health-check/http.controller.js";
import { ProcessOutboxMessagesScheduler } from "./use-cases/process-outbox-messages/scheduler.js";
import { ProcessOutboxMessagesUseCase } from "./use-cases/process-outbox-messages/use-case.js";

const ONE_MINUTE_IN_MILLISECONDS = 60_000;
const MAXIMUM_NUMBER_OF_REQUESTS_PER_MINUTE = 100;
const ENVIRONMENT_VARIABLES_SCHEMA = z.object({
  API_BASE_URL: z.string(),
  API_HTTP_HOST: z.string(),
  API_HTTP_PORT: z.string(),
  API_HTTP_SCHEME: z.enum(["http", "https"]),
  DATABASE_URL: z.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: ENVIRONMENT_VARIABLES_SCHEMA.parse,
    }),
    DrizzleModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.getOrThrow("DATABASE_URL"),
      }),
    }),
    EventEmitterModule.forRoot({ global: true }),
    ThrottlerModule.forRoot([
      {
        ttl: ONE_MINUTE_IN_MILLISECONDS,
        limit: MAXIMUM_NUMBER_OF_REQUESTS_PER_MINUTE,
      },
    ]),
  ],
  controllers: [HealthCheckHttpController],
  providers: [
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
      provide: EventEmitterToken,
      useValue: (await import("@nestjs/event-emitter")).EventEmitter2,
    },
    {
      provide: MailerToken,
      useClass: ConsoleMailer,
    },
    {
      provide: ProcessOutboxMessagesScheduler,
      useFactory: createFactoryFromConstructor(ProcessOutboxMessagesScheduler),
      inject: [ProcessOutboxMessagesUseCase],
    },
    {
      provide: ProcessOutboxMessagesUseCase,
      useFactory: createFactoryFromConstructor(ProcessOutboxMessagesUseCase),
      inject: [OutboxMessageRepositoryToken, EventEmitter2],
    },
  ],
  exports: [DrizzleModule, MailerToken, OutboxMessageRepositoryToken],
})
export class SharedKernelModule {}
