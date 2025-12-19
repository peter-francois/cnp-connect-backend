import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { ChatGatewayV2 } from "./gateways/chat.gatewayV2";

@Module({
  controllers: [MessageController],
  providers: [MessageService, ChatGatewayV2],
  imports: [NatsClientModule],
})
export class MessageModule {}
