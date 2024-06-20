import { Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
})
export class ApplicationModule implements OnApplicationShutdown {
  private readonly logger = new Logger(ApplicationModule.name);

  onApplicationShutdown() {
    this.logger.warn("Application is shutting down...");
    process.exit(0);
  }
}
