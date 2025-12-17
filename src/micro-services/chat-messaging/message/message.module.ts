import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { ChatGateway } from "src/message-listener/socket-io.gateway";
import { MessageListenerService } from "src/message-listener/messageListener.service";

@Module({
  controllers: [MessageController],
  providers: [MessageService, ChatGateway, MessageListenerService],
  imports: [NatsClientModule],
})
export class MessageModule {}
