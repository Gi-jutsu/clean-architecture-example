import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DrizzleModule } from "./drizzle/drizzle.module.js";

@Module({
  imports: [
    DrizzleModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.get("DATABASE_CONNECTION_STRING"),
      }),
    }),
  ],
  exports: [DrizzleModule],
})
export class DatabaseModule {}
