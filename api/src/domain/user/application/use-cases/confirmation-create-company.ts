import { left, right } from "@/core/either";
import { CompaniesRepository } from "../repositories/companies-repository";
import { TempUsersRepository } from "../repositories/temp-users-repository";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { User, UserRole } from "../../enterprise/entities/user";
import { Company } from "../../enterprise/entities/company";

interface ConfirmationCreateCompanyUseCaseRequest {
  token: string;
}

export class ConfirmationCreateCompanyUseCase {
  constructor(
    private tempUsersRepository: TempUsersRepository,
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository
  ) {}

  async execute({ token }: ConfirmationCreateCompanyUseCaseRequest) {
    const tempUser = await this.tempUsersRepository.findByToken(token);

    if (!tempUser) {
      return left(new ResourceTokenNotFoundError());
    }

    const alreadyExistsCompany = await this.companiesRepository.findByCnpj(
      tempUser.cnpj
    );

    if (alreadyExistsCompany) {
      return left(new AlreadyExistsCnpjError());
    }

    const alreadyExistsEmail = await this.usersRepository.findByEmail(
      tempUser.email
    );

    if (alreadyExistsEmail) {
      return left(new AlreadyExistsEmailError());
    }

    if (tempUser.expiration < new Date()) {
      return left(new ResourceTokenNotFoundError());
    }

    const company = Company.create({
      cnpj: tempUser.cnpj,
      name: tempUser.companyName,
    });

    const user = User.create({
      email: tempUser.email,
      name: tempUser.userName,
      password: tempUser.password,
      role: UserRole.ADMIN,
      companyId: company.id.toString(),
    });

    company.users.push(user);

    await this.companiesRepository.create(company);

    return right({ user });
  }
}
