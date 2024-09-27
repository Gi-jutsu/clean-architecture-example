import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
import { ApplicationModule } from "./application.module.js";

export async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  application.enableShutdownHooks();
  application.use(cookieParser());
  application.useGlobalPipes(new ValidationPipe());

  const host = process.env.API_HTTP_HOST || "127.0.0.1";
  const port = process.env.API_HTTP_PORT || "8080";
  const scheme = process.env.API_HTTP_SCHEME || "http";
  const url = `${scheme}://${host}:${port}`;

  await application.listen(port, host, () =>
    console.log(`🚀 API is running on ${url}`)
  );

  return application.getHttpServer();
}

// Run the application if the script is executed directly
const filename = fileURLToPath(import.meta.url);
if (process.argv[1] === filename) {
  void bootstrap();
}
