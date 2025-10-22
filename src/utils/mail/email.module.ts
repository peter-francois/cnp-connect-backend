import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "962c58002@smtp-brevo.com",
          pass: "bxZV9kESv0JUTC5j",
        },
        // @dev controler avec formateur l'erreur de certificat: "self-signed certificate in certificate chain"
        tls: {
          rejectUnauthorized: false, // ⚠️ désactive la vérif SSL
        },
      },
      defaults: {
        from: '"CNP Connect" <nicolassam33@gmail.com>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
