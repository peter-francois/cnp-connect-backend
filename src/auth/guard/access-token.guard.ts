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
export class AccesTokenGuard implements CanActivate {
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
        "ATG-ca-1",
      );
    }
    try {
      const payload: PayloadInterface = await this.jwtService.verifyAsync(
        token,
        { secret: process.env.ACCESS_JWT_SECRET },
      );

      request["user"] = payload;
    } catch {
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "ATG-ca-2",
      );
    }
    return true;
  }
}
