import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { TokenService } from "src/auth/token.service";
import { UserService } from "src/user/user.service";
import { DatabaseUserRepository } from "src/user/user.repository";
import { AuthService } from "src/auth/auth.service";
import { ChatGatewayV2 } from "../gateways/chat.gatewayV2";

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    ChatGatewayV2,
    TokenService,
    UserService,
    DatabaseUserRepository,
    AuthService,
  ],
  imports: [NatsClientModule],
})
export class MessageModule {}
