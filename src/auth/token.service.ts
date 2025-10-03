import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: User, options: JwtSignOptions): Promise<string> {
    const payload = { sub: user.id, role: user.role };
    return await this.jwtService.signAsync(payload, options);
  }
}
