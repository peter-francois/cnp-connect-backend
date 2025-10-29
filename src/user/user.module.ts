import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseUserRepository } from "./user.repository";
import { AuthService } from "src/auth/auth.service";
import { TokenService } from "src/auth/token.service";
import { UuidModule } from "nestjs-uuid";
import { ConfigService } from "@nestjs/config";
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";

@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseUserRepository, AuthService, TokenService],
  exports: [UserService],
  imports: [
    UuidModule,
    ClientsModule.register([
      {
        name: "NATS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: [`nats://${process.env.NATS_DNS}:${process.env.NATS_PORT}`],
        },
      },
    ]),
  ],
})
export class UserModule {}
