import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HealthCheckHttpController } from "./use-cases/health-check/http.controller.js";

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HealthCheckHttpController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedKernelModule {}
