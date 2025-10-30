import { Module } from "@nestjs/common";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";
import { NatsClientModule } from "src/nats-client.module";

@Module({
  imports: [NatsClientModule],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
