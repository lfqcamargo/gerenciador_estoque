import { TempUser } from "@/domain/user/enterprise/entities/tempUser";
import { UsersRepository } from "../repositories/users-repository";
import { TempUsersRepository } from "../repositories/temp-users-repository";
import { CompaniesRepository } from "../repositories/companies-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { Either, left, right } from "@/core/either";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { Injectable } from "@nestjs/common";

interface CreateTempUserUseCaseRequest {
  cnpj: string;
  companyName: string;
  email: string;
  userName: string;
  password: string;
}

type CreateTempUserUseCaseResponse = Either<
  AlreadyExistsCnpjError | AlreadyExistsEmailError,
  { tempUser: TempUser }
>;

@Injectable()
export class CreateTempUserUseCase {
  constructor(
    private tempUsersRepository: TempUsersRepository,
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
  }: CreateTempUserUseCaseRequest): Promise<CreateTempUserUseCaseResponse> {
    const companyExists = await this.companiesRepository.findByCnpj(cnpj);

    if (companyExists) {
      return left(new AlreadyExistsCnpjError());
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      return left(new AlreadyExistsEmailError());
    }

    const alreadyExists = await this.tempUsersRepository.findByEmail(email);

    if (alreadyExists) {
      await this.tempUsersRepository.delete(alreadyExists);
    } else {
      const alreadyExists = await this.tempUsersRepository.findByCnpj(cnpj);

      if (alreadyExists) {
        await this.tempUsersRepository.delete(alreadyExists);
      }
    }

    const token = await this.hashGenerator.hash(email);
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day
    const hashedPassword = await this.hashGenerator.hash(password);

    const tempUser = TempUser.create({
      cnpj,
      companyName,
      email,
      userName,
      password: hashedPassword,
      token,
      expiration,
    });

    await this.tempUsersRepository.create(tempUser);

    return right({ tempUser });
  }
}
