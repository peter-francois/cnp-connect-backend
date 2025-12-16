import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./utils/mail/email.module";
import { TokenService } from "./auth/token.service";
import { ConfigModule } from "@nestjs/config";
import { ChatMessagingModule } from "./micro-services/chat-messaging/chat-messaging.module";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
    ConfigModule.forRoot(),
    ChatMessagingModule,
  ],
  // @dev ne devrais pas avoir de TokenService
  providers: [TokenService],
})
export class AppModule {}
