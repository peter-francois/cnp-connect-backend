import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { EmailService } from "src/utils/mail/email.service";
import { PrismaService } from "prisma/prisma.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, EmailService, PrismaService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
