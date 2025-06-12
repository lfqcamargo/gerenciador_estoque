import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { User } from "../../enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { TempUsersRepository } from "../repositories/temp-users-repository";

interface ConfirmationCreateUserUseCaseRequest {
  token: string;
  password: string;
}

type ConfirmationCreateUserUseCaseResponse = Either<
  ResourceTokenNotFoundError | AlreadyExistsCnpjError | AlreadyExistsEmailError,
  {
    user: User;
  }
>;

@Injectable()
export class ConfirmationCreateUserUseCase {
  constructor(
    private tempUsersRepository: TempUsersRepository,
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    token,
    password,
  }: ConfirmationCreateUserUseCaseRequest): Promise<ConfirmationCreateUserUseCaseResponse> {
    const tempUser = await this.tempUsersRepository.findByToken(token);

    if (!tempUser) {
      return left(new ResourceTokenNotFoundError());
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

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      email: tempUser.email,
      name: tempUser.name,
      password: hashedPassword,
      role: tempUser.userRole,
      companyId: tempUser.companyId,
      active: true,
    });

    await this.tempUsersRepository.delete(tempUser);
    await this.usersRepository.create(user);

    return right({ user });
  }
}
