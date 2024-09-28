import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MapErrorToRfc9457HttpException } from "./infrastructure/map-error-to-rfc9457-http-exception.interceptor.js";
import { HealthCheckHttpController } from "./use-cases/health-check/http.controller.js";

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HealthCheckHttpController],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MapErrorToRfc9457HttpException,
    },
  ],
  exports: [ConfigService],
})
export class SharedKernelModule {}
