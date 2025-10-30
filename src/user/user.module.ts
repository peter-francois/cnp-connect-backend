import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseUserRepository } from "./user.repository";
import { AuthService } from "src/auth/auth.service";
import { TokenService } from "src/auth/token.service";
import { UuidModule } from "nestjs-uuid";

@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseUserRepository, AuthService, TokenService],
  exports: [UserService],
  imports: [UuidModule],
})
export class UserModule {}
