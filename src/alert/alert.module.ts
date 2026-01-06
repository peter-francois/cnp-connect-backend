import { Module } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";
import { TokenService } from "src/auth/token.service";

@Module({
  controllers: [AlertController],
  providers: [AlertService, TokenService],
})
export class AlertModule {}
