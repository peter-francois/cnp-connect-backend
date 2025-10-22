import { HttpStatus, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { CustomException } from "src/utils/custom-exception";
import { ChangePasswordInterface } from "./interfaces/changePassword.interface";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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

  async changePassword(
    body: ChangePasswordInterface,
  ): Promise<{ password: string }> {
    const { id, password } = body;
    await this.prisma.user.findUniqueOrThrow({ where: { id } });

    const hashedPassword = await this.hash(password);

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: { password: true },
    });
  }
}
