import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { EmailsRepository } from "@/domain/notification/application/repositories/emails-repository";
import { PrismaEmailsRepository } from "./prisma/repositories/prisma-emails-repository";
import { AttachmentsRepository } from "@/domain/shared/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";

@Module({
  providers: [
    PrismaService,
    { provide: CompaniesRepository, useClass: PrismaCompaniesRepository },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: EmailsRepository, useClass: PrismaEmailsRepository },
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
  ],
  exports: [
    PrismaService,
    CompaniesRepository,
    UsersRepository,
    EmailsRepository,
    AttachmentsRepository,
  ],
})
export class DatabaseModule {}
