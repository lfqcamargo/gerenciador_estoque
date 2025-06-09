import { Module } from "@nestjs/common";
import { OnTempCompanyCreated } from "../../domain/notification/application/subscribers/on-temp-company-created";
import { SendEmailUseCase } from "../../domain/notification/application/use-cases/send-email";
import { EmailModule } from "@/infra/event/email/email.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { OnPasswordTokenCreated } from "@/domain/notification/application/subscribers/on-password-token-created";
import { OnChangePassword } from "@/domain/notification/application/subscribers/on-change-password";
import { RedisModule } from "@/infra/cache/redis/redis.module";
import { TempCompaniesRepository } from "@/domain/user/application/repositories/temp-companies-repository";
import { RedisTempCompaniesRepository } from "@/infra/cache/redis/repositories/redis-temp-compánies-repository";
import { OnCompanyCreated } from "@/domain/user/application/subscribers/on-company-created";
import { OnTempUserCreated } from "@/domain/notification/application/subscribers/on-temp-user-created";
import { RedisTempUsersRepository } from "../cache/redis/repositories/redis-temp-users-repository";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";

@Module({
  imports: [DatabaseModule, EmailModule, RedisModule],
  providers: [
    SendEmailUseCase,
    OnTempCompanyCreated,
    OnPasswordTokenCreated,
    OnChangePassword,
    OnCompanyCreated,
    OnTempUserCreated,
    {
      provide: TempCompaniesRepository,
      useClass: RedisTempCompaniesRepository,
    },
    {
      provide: TempUsersRepository,
      useClass: RedisTempUsersRepository,
    },
  ],
})
export class EventModule {}
