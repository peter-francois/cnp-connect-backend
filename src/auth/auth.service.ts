import { HttpStatus, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { CustomException } from "src/utils/custom-exception";
import { PrismaService } from "prisma/prisma.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
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
  ): Promise<{ password: string | null }> {
    const { password } = body;
    await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const hashedPassword = await this.hash(password);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { password: true },
    });
  }
}
