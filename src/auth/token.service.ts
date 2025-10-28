import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { TokenTypeEnum, Token, RoleEnum } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { PayloadInterface } from "./interfaces/payload.interface";
import { TokensInterface } from "./interfaces/token.interface";
import { Request } from "express";
import { CustomException } from "src/utils/custom-exception";
import { AuthService } from "./auth.service";
import { v4 as uuidv4 } from "uuid";

// add salt ?

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async generateJwt(
    payload: PayloadInterface,
    options: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, options);
  }

  async upsert(
    userId: string,
    token: string,
    type: TokenTypeEnum = TokenTypeEnum.REFRESH_TOKEN,
    expiresAt?: Date,
  ): Promise<Token> {
    return await this.prisma.token.upsert({
      create: { userId, token, expiresAt, type },
      where: { type_userId: { type, userId } },
      update: { token, expiresAt },
    });
  }

  async getRefreshToken(
    userId: string,
    type: TokenTypeEnum = TokenTypeEnum.REFRESH_TOKEN,
  ): Promise<Token> {
    return await this.prisma.token.findUniqueOrThrow({
      where: { type_userId: { type, userId } },
    });
  }

  async createTokens(id: string, role: RoleEnum): Promise<TokensInterface> {
    const accessToken: string = await this.generateJwt(
      { id, role },
      {
        algorithm: "HS256",
        // expiresIn: "15m",
        expiresIn: "1h",
        secret: process.env.ACCESS_JWT_SECRET,
      },
    );

    const refreshToken: string = await this.generateJwt(
      { id, role },
      {
        algorithm: "HS256",
        expiresIn: "1d",
        secret: process.env.REFRESH_JWT_SECRET,
      },
    );

    return { accessToken, refreshToken };
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === process.env.TOKEN_TYPE ? token : undefined;
  }

  generateEmailToken(): string {
    try {
      const uuid: string = uuidv4();
      return uuid;
    } catch {
      throw new CustomException(
        "Error generating UUID",
        HttpStatus.INTERNAL_SERVER_ERROR,
        "TS-get-1",
      );
    }
  }

  async getUserIdByToken(token: string): Promise<string> {
    const tokenField = await this.prisma.token.findUniqueOrThrow({
      where: { token },
    });
    return tokenField.userId;
  }
}
