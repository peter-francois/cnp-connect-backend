import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
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
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExeptionFilter(), new CustomExceptionFilter());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
