import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaTempUsersRepository } from "./prisma/repositories/prisma-temp-users-repository";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";

@Module({
  providers: [
    PrismaService,
    { provide: TempUsersRepository, useClass: PrismaTempUsersRepository },
    { provide: CompaniesRepository, useClass: PrismaCompaniesRepository },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [
    PrismaService,
    TempUsersRepository,
    CompaniesRepository,
    UsersRepository,
  ],
})
export class DatabaseModule {}
