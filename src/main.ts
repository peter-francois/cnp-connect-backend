import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { PrismaExeptionFilter } from "./utils/filters/prisma-exeption.filter";
import { CustomExceptionFilter } from "./utils/filters/custom-exception.filter";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages:
        process.env.NODE_ENV === "development" ? false : true,
    }),
  );
  const logger = new Logger("Test");
  logger.warn("process.env.FRONTEND_URL = " + process.env.FRONTEND_URL);

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.setGlobalPrefix(process.env.NODE_ENV === "development" ? "api" : "");
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExeptionFilter(), new CustomExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
