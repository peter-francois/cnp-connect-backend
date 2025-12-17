import { Module } from "@nestjs/common";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { MessageListenerService } from "./messageListener.service";
import { ChatGateway } from "./socket-io.gateway";

@Module({
  imports: [NatsClientModule],
  providers: [MessageListenerService, ChatGateway],
})
export class MessageListenerModule {}
