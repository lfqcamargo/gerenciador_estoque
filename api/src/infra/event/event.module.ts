import { Module } from "@nestjs/common";
import { OnTempUserCreated } from "../../domain/notification/application/subscribers/on-temp-user-created";
import { SendEmailUseCase } from "../../domain/notification/application/use-cases/send-email";
import { EmailModule } from "@/infra/event/email/email.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { OnPasswordTokenCreated } from "@/domain/notification/application/subscribers/on-password-token-created";
import { OnChangePassword } from "@/domain/notification/application/subscribers/on-change-password";
import { RedisModule } from "@/infra/cache/redis/redis.module";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { RedisTempUsersRepository } from "@/infra/cache/redis/repositories/redis-temp-users-repository";
import { OnCompanyCreated } from "@/domain/user/application/subscribers/on-company-created";

@Module({
  imports: [DatabaseModule, EmailModule, RedisModule],
  providers: [
    SendEmailUseCase,
    OnTempUserCreated,
    OnPasswordTokenCreated,
    OnChangePassword,
    OnCompanyCreated,
    {
      provide: TempUsersRepository,
      useClass: RedisTempUsersRepository,
    },
  ],
})
export class EventModule {}
