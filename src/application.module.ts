import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthCheckHttpController } from "./shared-kernel/use-cases/health-check/http.controller.js";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HealthCheckHttpController],
})
export class ApplicationModule implements OnApplicationShutdown {
  private readonly logger = new Logger(ApplicationModule.name);

  onApplicationShutdown() {
    this.logger.warn("Application is shutting down...");
    process.exit(0);
  }
}
