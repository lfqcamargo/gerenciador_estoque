import { Company } from "@/domain/user/enterprise/entities/company";
import { CompaniesRepository } from "../repositories/companies-repository";
import { UsersRepository } from "../repositories/users-repository";
import { CompanyNotFoundError } from "./errors/company-not-found-error";
import { Either, left, right } from "@/core/either";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserRole } from "../../enterprise/entities/user";
import { UserNotAdminError } from "./errors/user-not-admin-error";
import { Injectable } from "@nestjs/common";

interface EditCompanyUseCaseRequest {
  companyId: string;
  authenticateUserId: string;
  name: string;
  lealName: string | null;
  photo: string | null;
}

type EditCompanyUseCaseResponse = Either<
  CompanyNotFoundError | UserNotFoundError | UserNotAdminError,
  {
    company: Company;
  }
>;

@Injectable()
export class EditCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    companyId,
    authenticateUserId,
    name,
    lealName,
    photo,
  }: EditCompanyUseCaseRequest): Promise<EditCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId);

    if (!company) {
      return left(new CompanyNotFoundError());
    }

    const user = await this.usersRepository.findById(authenticateUserId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (user.companyId.toString() !== companyId) {
      return left(new CompanyNotFoundError());
    }

    if (user.role !== UserRole.ADMIN) {
      return left(new UserNotAdminError());
    }

    company.name = name;
    company.lealName = lealName;
    company.photo = photo;

    await this.companiesRepository.save(company);

    return right({ company });
  }
}
