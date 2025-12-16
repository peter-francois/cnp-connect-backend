import { Module } from "@nestjs/common";
import { ConversationModule } from "./conversation/conversation.module";
import { MessageModule } from "./message/message.module";
import { NatsClientModule } from "../../utils/client-nats/nats-client.module";
import { GroupModule } from "./group/group.module";

@Module({
  imports: [NatsClientModule, ConversationModule, MessageModule, GroupModule],
})
export class ChatMessagingModule {}
