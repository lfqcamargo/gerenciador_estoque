import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Company } from "@/domain/user/enterprise/entities/company";
import { Company as PrismaCompany, Prisma } from "generated/prisma";

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create(
      {
        name: raw.name,
        cnpj: raw.cnpj,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      name: company.name,
      cnpj: company.cnpj,
    };
  }
}
