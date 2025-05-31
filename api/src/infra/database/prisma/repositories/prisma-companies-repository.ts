import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { Company } from "@/domain/user/enterprise/entities/company";
import { PrismaService } from "../prisma.service";
import { PrismaCompanyMapper } from "../mappers/prisma-company-mapper";

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(private prisma: PrismaService) {}

  async create(company: Company): Promise<void> {
    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPrisma(company),
    });
  }
  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { cnpj },
    });
    return company ? PrismaCompanyMapper.toDomain(company) : null;
  }
}
