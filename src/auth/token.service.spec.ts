import { Test } from "@nestjs/testing";
import { TokenService } from "./token.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { TokenTypeEnum } from "@prisma/client";

const prismaMock = {
  token: {
    upsert: jest.fn(),
  },
};

describe("tokenService", () => {
  let tokenService: TokenService;
  beforeEach(async () => {
    const specAuthModule = await Test.createTestingModule({
      providers: [
        TokenService,
        JwtService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    tokenService = specAuthModule.get<TokenService>(TokenService);
  });

  describe("upsert", () => {
    it("Should upsert token with sessionId if it's refreshToken", async () => {
      const refreshTokenToUpsert = {
        userId: "a-user-id",
        token: "token",
        type: TokenTypeEnum.REFRESH_TOKEN,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sessionId: "a-session-id",
      };

      const tokenWithSessionId = {
        sessionId: refreshTokenToUpsert.sessionId,
        token: refreshTokenToUpsert.token,
        type: refreshTokenToUpsert.type,
        userId: refreshTokenToUpsert.userId,
        createdAt: new Date(),
        expiresAt: refreshTokenToUpsert.expiresAt,
      };

      prismaMock.token.upsert.mockResolvedValue(tokenWithSessionId);

      const result = await tokenService.upsert(
        refreshTokenToUpsert.userId,
        refreshTokenToUpsert.token,
        refreshTokenToUpsert.type,
        refreshTokenToUpsert.expiresAt,
        refreshTokenToUpsert.sessionId,
      );

      expect(result).toBe(tokenWithSessionId);
      expect(prismaMock.token.upsert).toHaveBeenCalledTimes(1);
      expect(prismaMock.token.upsert).toHaveBeenCalledWith({
        create: {
          userId: refreshTokenToUpsert.userId,
          token: refreshTokenToUpsert.token,
          expiresAt: refreshTokenToUpsert.expiresAt,
          type: refreshTokenToUpsert.type,
          sessionId: refreshTokenToUpsert.sessionId,
        },
        where: {
          sessionId: refreshTokenToUpsert.sessionId,
          userId: refreshTokenToUpsert.userId,
        },
        update: {
          token: refreshTokenToUpsert.token,
          expiresAt: refreshTokenToUpsert.expiresAt,
        },
      });
    });

    it("Should upsert token without sessionId if it's resetPasswordToken", async () => {
      const resetPasswordTokenToUpsert = {
        userId: "a-user-id",
        token: "token",
        type: TokenTypeEnum.RESET_PASSWORD,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      const tokenWithoutSessionId = {
        token: resetPasswordTokenToUpsert.token,
        type: resetPasswordTokenToUpsert.type,
        userId: resetPasswordTokenToUpsert.userId,
        createdAt: new Date(),
        expiresAt: resetPasswordTokenToUpsert.expiresAt,
      };
      prismaMock.token.upsert.mockResolvedValue(tokenWithoutSessionId);

      const result = await tokenService.upsert(
        resetPasswordTokenToUpsert.userId,
        resetPasswordTokenToUpsert.token,
        resetPasswordTokenToUpsert.type,
        resetPasswordTokenToUpsert.expiresAt,
      );

      expect(result).toBe(tokenWithoutSessionId);
      expect(prismaMock.token.upsert).toHaveBeenCalledTimes(2);
      expect(prismaMock.token.upsert).toHaveBeenCalledWith({
        create: {
          userId: tokenWithoutSessionId.userId,
          token: tokenWithoutSessionId.token,
          expiresAt: tokenWithoutSessionId.expiresAt,
          type: tokenWithoutSessionId.type,
        },
        where: {
          token: tokenWithoutSessionId.token,
        },
        update: {
          token: tokenWithoutSessionId.token,
          expiresAt: tokenWithoutSessionId.expiresAt,
        },
      });
    });
  });
});
