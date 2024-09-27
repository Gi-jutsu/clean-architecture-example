import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Rfc9457ErrorInterceptor } from "./infrastructure/rfc9457-error.interceptor.js";
import { HealthCheckHttpController } from "./use-cases/health-check/http.controller.js";

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HealthCheckHttpController],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: Rfc9457ErrorInterceptor,
    },
  ],
  exports: [ConfigService],
})
export class SharedKernelModule {}
