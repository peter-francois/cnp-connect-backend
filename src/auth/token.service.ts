import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { User, TokenTypeEnum, Token } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

// add salt

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateJwt(user: User, options: JwtSignOptions): Promise<string> {
    const payload = { sub: user.id, role: user.role };
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
}
