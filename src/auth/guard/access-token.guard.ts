import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PayloadInterface } from "../interfaces/payload.interface";
import { CustomException } from "src/utils/custom-exception";

@Injectable()
export class AccesTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
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
        {
          secret: process.env.ACCESS_JWT_SECRET,
        },
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
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

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
