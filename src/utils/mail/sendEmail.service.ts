import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendEmailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail(
    to: string,
    subjectString: string,
    htmlString: string,
  ): Promise<any> {
    try {
      const result = await this.mailerService.sendMail({
        to,
        subject: subjectString,
        html: htmlString,
      });
      return { result };
    } catch (error) {
      console.error("Erreur envoi email", error);
      throw error;
    }
  }
}
