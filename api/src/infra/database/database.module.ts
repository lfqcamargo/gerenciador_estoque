import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaTempUsersRepository } from "./prisma/repositories/prisma-temp-users-repository";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

@Module({
  providers: [
    PrismaService,
    PrismaTempUsersRepository,
    PrismaCompaniesRepository,
    PrismaUsersRepository,
  ],
  exports: [
    PrismaService,
    PrismaTempUsersRepository,
    PrismaCompaniesRepository,
    PrismaUsersRepository,
  ],
})
export class DatabaseModule {}
