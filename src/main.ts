import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { PrismaExeptionFilter } from "./utils/filters/prisma-exeption.filter";
import { CustomExceptionFilter } from "./utils/filters/custom-exception.filter";

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages:
        process.env.NODE_ENV === "development" ? false : true,
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new PrismaExeptionFilter(), new CustomExceptionFilter());
  await app.listen(port);
}
console.log(`Gateway API is running on: http://localhost:${port}`);
bootstrap();
