import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { NatsClientModule } from "src/utils/client-nats/nats-client.module";

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [NatsClientModule],
})
export class MessageModule {}
