import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseUserRepository } from "./user.repository";

@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseUserRepository],
  exports: [UserService],
})
export class UserModule {}
