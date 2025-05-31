import { Module } from "@nestjs/common";
import { EmailSender } from "@/domain/notification/application/services/email-sender";
import { FakeEmailService } from "./fake-email.service";

@Module({
  providers: [
    {
      provide: EmailSender,
      useClass: FakeEmailService,
    },
  ],
  exports: [EmailSender],
})
export class EmailModule {}
