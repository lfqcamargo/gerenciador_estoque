import { CompaniesRepository } from "@/domain/user/application/repositories/companies-repository";
import { Company } from "@/domain/user/enterprise/entities/company";
import { InMemoryUsersRepository } from "./in-memory-users-repository";
import { InMemoryTempUsersRepository } from "./in-memory-temp-users-repository";
export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = [];

  constructor(
    private tempUsersRepository: InMemoryTempUsersRepository,
    private usersRepository: InMemoryUsersRepository
  ) {}

  async create(company: Company): Promise<void> {
    this.items.push(company);

    await this.usersRepository.create(company.users[0]);
    await this.tempUsersRepository.deleteByCnpj(company.cnpj);
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = this.items.find((item) => item.cnpj === cnpj);
    return company ?? null;
  }
}
