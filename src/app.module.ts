import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./utils/mail/email.module";
import { TokenService } from "./auth/token.service";
import { ConfigModule } from "@nestjs/config";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { TemplateModule } from "./template/template.module";
import { NatsClientModule } from "./nats-client.module";

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    NatsClientModule,
    UserModule,
    AuthModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TemplateModule,
  ],
  providers: [TokenService, AppService],
})
export class AppModule {}
