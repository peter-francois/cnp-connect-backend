import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { TokenTypeEnum, Token, RoleEnum } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { PayloadInterface } from "./interfaces/payload.interface";
import { TokensInterface } from "./interfaces/token.interface";

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
        expiresIn: "15m",
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
}
