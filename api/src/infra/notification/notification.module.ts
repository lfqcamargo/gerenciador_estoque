import { Module } from "@nestjs/common";
import { OnTempUserCreated } from "../../domain/notification/application/subscribers/on-temp-user-created";
import { SendEmailUseCase } from "../../domain/notification/application/use-cases/send-email";
import { EmailModule } from "@/infra/notification/email/email.module";
import { DatabaseModule } from "@/infra/database/database.module";

@Module({
  imports: [DatabaseModule, EmailModule],
  providers: [SendEmailUseCase, OnTempUserCreated],
})
export class NotificationModule {}
