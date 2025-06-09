import { TempCompany } from "@/domain/user/enterprise/entities/temp-company";
import { UsersRepository } from "../repositories/users-repository";
import { TempCompaniesRepository } from "../repositories/temp-companies-repository";
import { CompaniesRepository } from "../repositories/companies-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { Either, left, right } from "@/core/either";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateTempCompanyUseCaseRequest {
  cnpj: string;
  companyName: string;
  email: string;
  userName: string;
  password: string;
}

type CreateTempCompanyUseCaseResponse = Either<
  AlreadyExistsCnpjError | AlreadyExistsEmailError,
  { tempCompany: TempCompany }
>;

@Injectable()
export class CreateTempCompanyUseCase {
  constructor(
    private tempCompaniesRepository: TempCompaniesRepository,
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    cnpj,
    companyName,
    email,
    userName,
    password,
  }: CreateTempCompanyUseCaseRequest): Promise<CreateTempCompanyUseCaseResponse> {
    const companyExists = await this.companiesRepository.findByCnpj(cnpj);

    if (companyExists) {
      return left(new AlreadyExistsCnpjError());
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      return left(new AlreadyExistsEmailError());
    }

    const alreadyExists = await this.tempCompaniesRepository.findByEmail(email);

    if (alreadyExists) {
      await this.tempCompaniesRepository.delete(alreadyExists);
    } else {
      const alreadyExists = await this.tempCompaniesRepository.findByCnpj(cnpj);

      if (alreadyExists) {
        await this.tempCompaniesRepository.delete(alreadyExists);
      }
    }

    const token = new UniqueEntityID().toString();
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day
    const hashedPassword = await this.hashGenerator.hash(password);

    const tempCompany = TempCompany.create({
      cnpj,
      companyName,
      email,
      userName,
      password: hashedPassword,
      token,
      expiration,
    });

    await this.tempCompaniesRepository.create(tempCompany);

    return right({ tempCompany });
  }
}
