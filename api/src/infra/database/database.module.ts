import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaTempUsersRepository } from "./prisma/repositories/prisma-temp-users-repository";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { EmailsRepository } from "@/domain/notification/application/repositories/emails-repository";
import { PrismaEmailsRepository } from "./prisma/repositories/prisma-emails-repository";
import { PasswordTokensRepository } from "@/domain/user/application/repositories/password-tokens-repository";
import { PrismaPasswordTokensRepository } from "./prisma/repositories/prisma-password-tokens-repository";

@Module({
  providers: [
    PrismaService,
    { provide: TempUsersRepository, useClass: PrismaTempUsersRepository },
    { provide: CompaniesRepository, useClass: PrismaCompaniesRepository },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: EmailsRepository, useClass: PrismaEmailsRepository },
    {
      provide: PasswordTokensRepository,
      useClass: PrismaPasswordTokensRepository,
    },
  ],
  exports: [
    PrismaService,
    TempUsersRepository,
    CompaniesRepository,
    UsersRepository,
    EmailsRepository,
    PasswordTokensRepository,
  ],
})
export class DatabaseModule {}
