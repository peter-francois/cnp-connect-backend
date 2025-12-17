import { Module } from "@nestjs/common";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";
import { ConversationModule } from "./chat-messaging/conversation/conversation.module";
import { GroupModule } from "./chat-messaging/group/group.module";
import { MessageModule } from "./chat-messaging/message/message.module";

@Module({
  imports: [NatsClientModule, ConversationModule, MessageModule, GroupModule],
})
export class ChatMessagingModule {}
