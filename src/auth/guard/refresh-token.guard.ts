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

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken: string | undefined =
      this.extractTokenFromHeader(request);

    if (!refreshToken) {
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "RTG-ca-1",
      );
    }
    try {
      const payload: PayloadInterface = await this.jwtService.verifyAsync(
        refreshToken,
        { secret: process.env.REFRESH_JWT_SECRET },
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request["user"] = payload;
      request["refreshToken"] = refreshToken;
    } catch {
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "RTG-ca-2",
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === process.env.TOKEN_TYPE ? token : undefined;
  }
}
