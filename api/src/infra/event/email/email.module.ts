import { Module } from "@nestjs/common";
import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { RealEmailService } from "./nodemailer-email.service";

@Module({
  providers: [
    {
      provide: EmailSender,
      useClass: RealEmailService,
    },
  ],
  exports: [EmailSender],
})
export class EmailModule {}
