import { MailerService } from "@nestjs-modules/mailer";
import { HttpStatus, Injectable } from "@nestjs/common";
import { CustomException } from "../custom-exception";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subjectString: string,
    htmlString: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: subjectString,
        html: htmlString,
      });
    } catch (error) {
      throw new CustomException(
        error.message,
        HttpStatus.BAD_REQUEST,
        "ES-se-1",
      );
    }
  }
}
