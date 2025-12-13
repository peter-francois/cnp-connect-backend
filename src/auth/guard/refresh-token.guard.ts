import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PayloadWithSessionIdInterface } from "../interfaces/payload.interface";
import { CustomException } from "src/utils/custom-exception";
import { TokenService } from "../token.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken: string | undefined =
      this.tokenService.extractTokenCookie(request);

    if (!refreshToken) {
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "RTG-ca-1",
      );
    }

    try {
      const payload: PayloadWithSessionIdInterface =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.REFRESH_JWT_SECRET,
        });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request["user"] = payload;
      request["refreshToken"] = refreshToken;
    } catch {
      this.tokenService.delete(refreshToken);
      throw new CustomException(
        "Unauthorized exception",
        HttpStatus.UNAUTHORIZED,
        "RTG-ca-2",
      );
    }
    return true;
  }
}
