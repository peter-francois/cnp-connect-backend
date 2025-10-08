import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PayloadInterface } from "../interfaces/payload.interface";
import { CustomException } from "src/utils/custom-exception";
import { TokenService } from "../token.service";

@Injectable()
export class SupervisorGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined =
      this.tokenService.extractTokenFromHeader(request);

    if (!token) {
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "SG-ca-1",
      );
    }
    let payload: PayloadInterface;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });
    } catch {
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "ATG-ca-2",
      );
    }
    const role = payload.role;
    if (role !== "SUPERVISOR")
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "ATG-ca-3",
      );
    return true;
  }
}
