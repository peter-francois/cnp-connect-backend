import { MailerService } from "@nestjs-modules/mailer";
import { HttpStatus, Injectable } from "@nestjs/common";
import { CustomException } from "../custom-exception";
import { TokenService } from "src/auth/token.service";
import { User } from "@prisma/client";

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) {}

  async sendResetPassword(user: User): Promise<void> {
    const tokenUuid: string = await this.tokenService.generateTokenUuid(user);

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Voici le lien pour réinitialiser votre mot de passe",
        html: `<h1>Bonjour ${user.firstName}</h1>
          <p>Email envoyé via Cnp-Connect 🚀</p>
          <a href="http://localhost:5173/nouveau-mot-de-passe/${tokenUuid}">
            Cliquez ici pour réinitialiser votre mot de passe
          </a>`,
      });
    } catch (error) {
      throw new CustomException(
        error.message as string,
        HttpStatus.BAD_REQUEST,
        "ES-srp-1",
      );
    }
  }
}
