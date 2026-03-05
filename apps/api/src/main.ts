import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { GlobalExceptionFilter } from "src/lib/globalExceptionFilter";
import { AppModule } from "./app.module";

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3001",
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  const connection = app.get<Connection>(getConnectionToken());
  console.log(
    connection.readyState === 1
      ? `Connected to MongoDB (${connection.name})`
      : "Failed to connect to MongoDB",
  );
})();
