import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Company } from "@/domain/user/enterprise/entities/company";
import { Company as PrismaCompany, Prisma } from "generated/prisma";

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create(
      {
        cnpj: raw.cnpj,
        name: raw.name,
        lealName: raw.lealName,
        photo: raw.photo,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      cnpj: company.cnpj,
      name: company.name,
      lealName: company.lealName,
      photo: company.photo,
      createdAt: company.createdAt,
    };
  }
}
