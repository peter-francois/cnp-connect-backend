import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

interface responseBodyInterface {
  prismaCode: string;
  timestamp: string;
  path: string;
  requestBody?: Record<string, unknown>;
  message: string;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExeptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    let statusCode: number = HttpStatus.BAD_REQUEST;
    let responseBody: responseBodyInterface = {
      prismaCode: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: "unexepted prisma error",
    };
    switch (exception.code) {
      case "P2002":
        statusCode = HttpStatus.CONFLICT;
        responseBody = {
          ...responseBody,
          message: "Unique constraint failed",
          requestBody: request.body as Record<string, unknown>, // ????
        };
        break;

      default:
        break;
    }
    response.status(statusCode).json(responseBody);
  }
}
