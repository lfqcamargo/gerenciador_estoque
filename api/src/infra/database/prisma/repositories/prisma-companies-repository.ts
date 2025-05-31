import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { Company } from "@/domain/user/enterprise/entities/company";

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  create(company: Company): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByCnpj(cnpj: string): Promise<Company | null> {
    throw new Error("Method not implemented.");
  }
}
