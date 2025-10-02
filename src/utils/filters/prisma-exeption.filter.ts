import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaErrorEnum } from "../enums/prisma-error.enum";

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
      message: "Unexepted prisma error",
    };

    switch (exception.code as PrismaErrorEnum) {
      case PrismaErrorEnum.UniqueConstraintFailed:
        statusCode = HttpStatus.CONFLICT;
        responseBody = {
          ...responseBody,
          message: "Unique constraint failed",
          requestBody: request.body as Record<string, unknown>,
        };
        break;

      case PrismaErrorEnum.ForeignKeyConstraintFailed:
        statusCode = HttpStatus.CONFLICT;
        responseBody = {
          ...responseBody,
          message: "Foreign key constraint failed",
          requestBody: request.body as Record<string, unknown>,
        };
        break;

      case PrismaErrorEnum.RecordNotFound:
        statusCode = HttpStatus.NOT_FOUND;
        responseBody = {
          ...responseBody,
          message: "Record does not exist",
          requestBody: request.body as Record<string, unknown>,
        };
        break;

      default:
        break;
    }

    response.status(statusCode).json(responseBody);
  }
}
