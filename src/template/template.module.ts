import { Module } from "@nestjs/common";
import { TemplateController } from "./template.controller";
import { NatsClientModule } from "src/message_broker/nats-client.module";

@Module({
  imports: [NatsClientModule],
  controllers: [TemplateController],
})
export class TemplateModule {}
