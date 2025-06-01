import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { Company } from "@/domain/user/enterprise/entities/company";
import { PrismaService } from "../prisma.service";
import { PrismaCompanyMapper } from "../mappers/prisma-company-mapper";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(private prisma: PrismaService) {}

  async create(company: Company): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.company.create({
        data: PrismaCompanyMapper.toPrisma(company),
      });

      for (const user of company.users) {
        await tx.user.create({
          data: PrismaUserMapper.toPrisma(user),
        });
      }
    });

    DomainEvents.dispatchEventsForAggregate(company.id);
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    return company ? PrismaCompanyMapper.toDomain(company) : null;
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { cnpj },
    });
    return company ? PrismaCompanyMapper.toDomain(company) : null;
  }
}
