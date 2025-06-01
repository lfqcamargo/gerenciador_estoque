import { Injectable } from "@nestjs/common";
import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { Either, right, left } from "@/core/either";
import { SendEmailResponse } from "@/domain/notification/application/services/email-sender";
import * as nodemailer from "nodemailer";

@Injectable()
export class RealEmailService implements EmailSender {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.setupTransporter();
  }

  private async setupTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    try {
      const info = await this.transporter.sendMail({
        from: email.from ?? "noreply@example.com",
        to: email.to,
        subject: email.subject,
        html: email.body,
      });

      console.log("📧 Email enviado!");
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return right({ success: true });
    } catch (error) {
      console.error("❌ Erro ao enviar email:", error);
      return left(new Error("Falha ao enviar email"));
    }
  }
}
