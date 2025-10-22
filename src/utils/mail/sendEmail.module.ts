import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { SendEmailService } from "./sendEmail.service";

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
      },
      defaults: {
        from: '"CNP Connect" <nicolassam33@gmail.com>',
      },
    }),
  ],
  providers: [SendEmailService],
  exports: [SendEmailService],
})
export class sendMailModule {}
