import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./utils/mail/email.module";
import { TokenService } from "./auth/token.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
  ],
  providers: [TokenService],
})
export class AppModule {}
