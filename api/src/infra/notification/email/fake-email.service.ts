import { Injectable } from "@nestjs/common";
import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { Email } from "@/domain/notification/enterprise/entities/email";
import { Either, right } from "@/core/either";
import { SendEmailResponse } from "@/domain/notification/application/services/email-sender";

@Injectable()
export class FakeEmailService implements EmailSender {
  async sendEmail(email: Email): Promise<Either<Error, SendEmailResponse>> {
    console.log("📧 Fake email sent:", {
      to: email.to,
      subject: email.subject,
      body: email.body,
      from: email.from,
    });

    return right({ success: true });
  }
}
