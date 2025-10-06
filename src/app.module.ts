import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import { TokenService } from './auth/token.service';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  providers: [TokenService],
})
export class AppModule {}
