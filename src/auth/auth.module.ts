import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { EmailService } from "src/utils/mail/email.service";
import { PrismaService } from "prisma/prisma.service";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    EmailService,
    PrismaService,
    GoogleStrategy,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: "google" }),
    UserModule,
    JwtModule.register({
      global: true,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
