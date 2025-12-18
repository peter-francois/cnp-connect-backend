import { Module } from "@nestjs/common";
import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { NatsClientModule } from "../../utils/client-nats/nats-client.module";

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [NatsClientModule],
})
export class GroupModule {}
