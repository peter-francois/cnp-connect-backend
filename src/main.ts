import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { PrismaExeptionFilter } from "./utils/filters/prisma-exeption.filter";
import { CustomExceptionFilter } from "./utils/filters/custom-exception.filter";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { isInDevMode } from "./utils/variables";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.set("trust proxy", 1);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: isInDevMode ? false : true,
    }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExeptionFilter(), new CustomExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
