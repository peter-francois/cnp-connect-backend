import { Module } from "@nestjs/common";
import { GroupController } from "./group/group.controller";
import { GroupService } from "./group/group.service";
import { NatsClientModule } from "../nats-client.module";

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [NatsClientModule],
  exports: [GroupService],
})
export class ChatMessagingModule {}
