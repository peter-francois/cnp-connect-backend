import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./utils/mail/email.module";
import { TokenService } from "./auth/token.service";
import { AlertModule } from "./alert/alert.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule, EmailModule, AlertModule],
  providers: [TokenService],
})
export class AppModule {}
