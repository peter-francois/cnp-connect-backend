import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./utils/filters/http-exception.filter";
import { PrismaExeptionFilter } from "./utils/filters/prisma-exeption.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages:
        process.env.NODE_ENV === "development" ? false : true,
    }),
  );
  app.useGlobalFilters(
    process.env.NODE_ENV === "development"
      ? new PrismaExeptionFilter()
      : new HttpExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
