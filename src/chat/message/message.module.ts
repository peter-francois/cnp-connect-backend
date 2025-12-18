import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { ChatGateway } from "./gateways/chat.gateway";

@Module({
  controllers: [MessageController],
  providers: [MessageService, ChatGateway],
  imports: [NatsClientModule],
})
export class MessageModule {}
