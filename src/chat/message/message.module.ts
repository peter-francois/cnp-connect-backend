import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { ChatGatewayV2 } from "./gateways/chat.gatewayV2";
import { TokenService } from "src/auth/token.service";

@Module({
  controllers: [MessageController],
  providers: [MessageService, ChatGatewayV2, TokenService],
  imports: [NatsClientModule],
})
export class MessageModule {}
