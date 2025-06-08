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
        photoId: raw.photoId,
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
      photoId: company.photoId,
      createdAt: company.createdAt,
    };
  }
}
