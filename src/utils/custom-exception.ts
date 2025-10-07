import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
  constructor(
    response: string,
    status: HttpStatus,
    private errorCode: string,
  ) {
    super(response, status);
  }

  getErrorCode(): string {
    return this.errorCode;
  }
}
