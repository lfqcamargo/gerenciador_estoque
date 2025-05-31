import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { Company } from "@/domain/user/enterprise/entities/company";
import { InMemoryUsersRepository } from "./in-memory-users-repository";

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = [];

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async create(company: Company): Promise<void> {
    this.items.push(company);

    await this.usersRepository.create(company.users[0]);
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = this.items.find((item) => item.cnpj === cnpj);
    return company ?? null;
  }
}
