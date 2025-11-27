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

// @dev on a plus besoin de verifié le token car on est déja forcément passé par l'acces guard
@Injectable()
export class CoordinatorGuard implements CanActivate {
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
        "CG-ca-1",
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
        "CG-ca-2",
      );
    }
    const role = payload.role;
    if (role !== "COORDINATOR")
      throw new CustomException(
        "You do not have permission to access this resource",
        HttpStatus.FORBIDDEN,
        "CG-ca-3",
      );
    return true;
  }
}
