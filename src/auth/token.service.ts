import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { TokenTypeEnum, Token, RoleEnum, User } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { PayloadInterface } from "./interfaces/payload.interface";
import { TokensInterface } from "./interfaces/token.interface";
import { Request, Response } from "express";
import { CustomException } from "src/utils/custom-exception";
import { v4 as uuidv4 } from "uuid";

// add salt ?

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
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

  async generateTokenUuid(user: User): Promise<string> {
    const uuid: string = uuidv4();

    await this.upsert(
      user.id,
      uuid,
      "RESET_PASSWORD",
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    );
    return uuid;
  }

  async getUserIdByToken(token: string): Promise<string> {
    const tokenField = await this.prisma.token.findUniqueOrThrow({
      where: { token },
    });

    if (tokenField.expiresAt && tokenField.expiresAt <= new Date()) {
      await this.prisma.token.delete({ where: { token } });

      throw new CustomException(
        "Token expired",
        HttpStatus.UNAUTHORIZED,
        "TS-guidbt-1",
      );
    }

    return tokenField.userId;
  }

  addTokenInResponseAsCookie(response: Response, refreshToken: string): void {
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 3600 * 1000,
    });
  }
}
