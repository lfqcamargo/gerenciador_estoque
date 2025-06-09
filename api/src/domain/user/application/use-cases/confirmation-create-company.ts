import { Either, left, right } from "@/core/either";
import { CompaniesRepository } from "../repositories/companies-repository";
import { TempCompaniesRepository } from "../repositories/temp-companies-repository";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { User, UserRole } from "../../enterprise/entities/user";
import { Company } from "../../enterprise/entities/company";
import { Injectable } from "@nestjs/common";

interface ConfirmationCreateCompanyUseCaseRequest {
  token: string;
}

type ConfirmationCreateCompanyUseCaseResponse = Either<
  ResourceTokenNotFoundError | AlreadyExistsCnpjError | AlreadyExistsEmailError,
  {
    user: User;
  }
>;

@Injectable()
export class ConfirmationCreateCompanyUseCase {
  constructor(
    private tempCompaniesRepository: TempCompaniesRepository,
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository
  ) {}

  async execute({
    token,
  }: ConfirmationCreateCompanyUseCaseRequest): Promise<ConfirmationCreateCompanyUseCaseResponse> {
    const tempCompany = await this.tempCompaniesRepository.findByToken(token);

    if (!tempCompany) {
      return left(new ResourceTokenNotFoundError());
    }

    const alreadyExistsCompany = await this.companiesRepository.findByCnpj(
      tempCompany.cnpj
    );

    if (alreadyExistsCompany) {
      return left(new AlreadyExistsCnpjError());
    }

    const alreadyExistsEmail = await this.usersRepository.findByEmail(
      tempCompany.email
    );

    if (alreadyExistsEmail) {
      return left(new AlreadyExistsEmailError());
    }

    if (tempCompany.expiration < new Date()) {
      return left(new ResourceTokenNotFoundError());
    }

    const company = Company.create({
      cnpj: tempCompany.cnpj,
      name: tempCompany.companyName,
    });

    const user = User.create({
      email: tempCompany.email,
      name: tempCompany.userName,
      password: tempCompany.password,
      role: UserRole.ADMIN,
      companyId: company.id.toString(),
    });

    company.users.push(user);

    await this.companiesRepository.create(company);

    return right({ user });
  }
}
