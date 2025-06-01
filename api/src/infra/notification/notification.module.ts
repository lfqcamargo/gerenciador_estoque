import { Module } from "@nestjs/common";
import { OnTempUserCreated } from "../../domain/notification/application/subscribers/on-temp-user-created";
import { SendEmailUseCase } from "../../domain/notification/application/use-cases/send-email";
import { EmailModule } from "@/infra/notification/email/email.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { OnPasswordTokenCreated } from "@/domain/notification/application/subscribers/on-password-token-created";
import { OnChangePassword } from "@/domain/notification/application/subscribers/on-change-password";

@Module({
  imports: [DatabaseModule, EmailModule],
  providers: [
    SendEmailUseCase,
    OnTempUserCreated,
    OnPasswordTokenCreated,
    OnChangePassword,
  ],
})
export class NotificationModule {}
