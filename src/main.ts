import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./application.module.js";

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule);
  application.enableShutdownHooks();

  const host = process.env.API_HTTP_HOST || "127.0.0.1";
  const port = process.env.API_HTTP_PORT || "8080";
  const scheme = process.env.API_HTTP_SCHEME || "http";
  const url = `${scheme}://${host}:${port}`;

  await application.listen(port, host, () =>
    console.log(`🚀 API is running on ${url}`)
  );
}

void bootstrap();
