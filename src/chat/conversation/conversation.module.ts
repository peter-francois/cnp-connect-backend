import { Module } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationController } from "./conversation.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [NatsClientModule],
})
export class ConversationModule {}
