import { Module } from "@nestjs/common";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { ConversationModule } from "./conversation/conversation.module";
import { GroupModule } from "./group/group.module";
import { MessageModule } from "./message/message.module";

@Module({
  imports: [NatsClientModule, ConversationModule, MessageModule, GroupModule],
})
export class ChatMessagingModule {}
