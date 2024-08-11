import { IdentityAndAccessModule } from "@identity-and-access/identity-and-access.module.js";
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { SharedKernelModule } from "@shared-kernel/shared-kernel.module.js";
import { HealthCheckHttpController } from "@shared-kernel/use-cases/health-check/http.controller.js";

@Module({
  imports: [IdentityAndAccessModule, SharedKernelModule],
  controllers: [HealthCheckHttpController],
})
export class ApplicationModule implements OnApplicationShutdown {
  private readonly logger = new Logger(ApplicationModule.name);

  onApplicationShutdown() {
    this.logger.warn("Application is shutting down...");
    process.exit(0);
  }
}
