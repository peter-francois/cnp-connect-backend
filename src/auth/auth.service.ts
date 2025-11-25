import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { CustomException } from "src/utils/custom-exception";
import { PrismaService } from "prisma/prisma.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UserService } from "src/user/user.service";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  hash(data: string): Promise<string> {
    try {
      return argon2.hash(data);
    } catch {
      throw new CustomException("BadRequest", HttpStatus.BAD_REQUEST, "AS-h-1");
    }
  }

  compare(hashed: string, noHashed: string): Promise<boolean> {
    try {
      return argon2.verify(hashed, noHashed);
    } catch {
      throw new CustomException("BadRequest", HttpStatus.BAD_REQUEST, "AS-c-1"); // a voir si c'est util revoir
    }
  }

  async resetPassword(
    body: ResetPasswordDto,
    userId: string,
  ): Promise<{ password: string }> {
    const { password } = body;
    await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const hashedPassword = await this.hash(password);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { password: true },
    });
  }

  async signout(userId: string): Promise<void> {
    await this.userService.update(userId, { isConnected: false });
    await this.tokenService.deleteRefreshToken(userId);
  }
}
