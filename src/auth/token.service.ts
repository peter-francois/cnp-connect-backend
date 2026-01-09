import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { TokenTypeEnum, Token, User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import {
  PayloadInterface,
  PayloadWithSessionIdInterface,
} from "./interfaces/payload.interface";
import { TokensInterface } from "./interfaces/token.interface";
import { Request, Response } from "express";
import { CustomException } from "../utils/custom-exception";
import { v4 as uuidv4 } from "uuid";
import { isInDevMode } from "src/utils/variables";

// add salt ?

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateJwt(
    payload: PayloadInterface | PayloadWithSessionIdInterface,
    options: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, options);
  }

  async upsert(
    userId: string,
    token: string,
    type: TokenTypeEnum = TokenTypeEnum.REFRESH_TOKEN,
    expiresAt?: Date,
    sessionId?: string,
  ): Promise<Token> {
    if (type === TokenTypeEnum.REFRESH_TOKEN) {
      return await this.prisma.token.upsert({
        create: {
          userId,
          token,
          expiresAt,
          type,
          sessionId,
        },
        where: { userId, sessionId },
        update: { token, expiresAt },
      });
    }
    return await this.prisma.token.upsert({
      create: { userId, token, expiresAt, type },
      where: { token },
      update: { token, expiresAt },
    });
  }

  async getRefreshToken(userId: string, sessionId: string): Promise<string> {
    const tokenObject: Token = await this.prisma.token.findUniqueOrThrow({
      where: { userId, sessionId },
    });
    return tokenObject.token;
  }

  async createTokens(id: string, sessionId: string): Promise<TokensInterface> {
    const accessToken: string = await this.generateJwt(
      { id },
      {
        algorithm: "HS256",
        expiresIn: "15m",
        secret: process.env.ACCESS_JWT_SECRET,
      },
    );

    const refreshToken: string = await this.generateJwt(
      { id, sessionId },
      {
        algorithm: "HS256",
        expiresIn: "1d",
        secret: process.env.REFRESH_JWT_SECRET,
      },
    );

    return { accessToken, refreshToken };
  }

  async delete(token: string): Promise<void> {
    await this.prisma.token.delete({ where: { token } });
  }

  async deleteRefreshToken(userId: string, sessionId: string): Promise<void> {
    await this.prisma.token.delete({
      where: { userId, sessionId },
    });
  }

  extractTokenFromHeader(request: Request): string | undefined {
    console.log(
      "🚀 ~ token.service.ts:97 ~ extractTokenFromHeader ~ request:",
      request,
    );
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    console.log(
      "🚀 ~ token.service.ts:98 ~ extractTokenFromHeader ~ token:",
      token,
    );
    console.log(
      "🚀 ~ token.service.ts:98 ~ extractTokenFromHeader ~ type:",
      type,
    );
    return type === process.env.TOKEN_TYPE ? token : undefined;
  }

  extractTokenCookie(request: Request): string {
    const tokenFromCookie: string = request.cookies["refreshToken"];
    return tokenFromCookie;
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
    const tokenObject = await this.prisma.token.findUniqueOrThrow({
      where: { token },
    });

    if (tokenObject.expiresAt && tokenObject.expiresAt <= new Date()) {
      await this.prisma.token.delete({ where: { token } });

      throw new CustomException(
        "Token expired",
        HttpStatus.UNAUTHORIZED,
        "TS-guidbt-1",
      );
    }

    return tokenObject.userId;
  }

  addRefreshTokenInResponseAsCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 3600 * 1000,
      sameSite: isInDevMode ? "lax" : "none",
      secure: isInDevMode ? false : true,
      path: "/api/auth",
    });
  }

  removeRefreshTokenInResponseAsCookie(response: Response): void {
    response.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: isInDevMode ? "lax" : "none",
      secure: isInDevMode ? false : true,
      path: "/api/auth",
    });
  }
}
