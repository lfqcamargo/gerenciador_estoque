import { Either, left, right } from "@/core/either";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";
import { CompaniesRepository } from "../repositories/companies-repository";
import { CompanyNotFoundError } from "./errors/company-not-found-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotBelongToCompanyError } from "./errors/user-not-belong-to-company-error";
import { Injectable } from "@nestjs/common";

interface FetchUsersUseCaseRequest {
  companyId: string;
  authenticatedUserId: string;
}

type FetchUsersUseCaseResult = Either<
  CompanyNotFoundError | UserNotFoundError | UserNotBelongToCompanyError,
  { users: User[] }
>;

@Injectable()
export class FetchUsersCompanyIdUseCase {
  constructor(
    private companyRepository: CompaniesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    companyId,
    authenticatedUserId,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResult> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      return left(new CompanyNotFoundError());
    }

    const user = await this.usersRepository.findById(authenticatedUserId);
    if (!user) {
      return left(new UserNotFoundError());
    }

    if (user.companyId !== companyId) {
      return left(new UserNotBelongToCompanyError());
    }

    const users = await this.usersRepository.fetchAll(companyId);
    return right({ users });
  }
}
