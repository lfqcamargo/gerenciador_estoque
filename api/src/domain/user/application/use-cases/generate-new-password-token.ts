import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repositories/users-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { PasswordTokensRepository } from "../repositories/password-tokens-repository";
import { PasswordToken } from "../../enterprise/entities/passwordToken";
import { Injectable } from "@nestjs/common";

interface GenerateNewPasswordTokenUseCaseRequest {
  email: string;
}

interface GenerateNewPasswordTokenUseCaseResponse {
  token: string;
  expiration: Date;
}

type GenerateNewPasswordTokenUseCaseResult = Either<
  UserNotFoundError,
  GenerateNewPasswordTokenUseCaseResponse
>;

@Injectable()
export class GenerateNewPasswordTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordTokensRepository: PasswordTokensRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    email,
  }: GenerateNewPasswordTokenUseCaseRequest): Promise<GenerateNewPasswordTokenUseCaseResult> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const token = await this.hashGenerator.hash(
      user.id.toString() + new Date().getTime().toString()
    );

    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const passwordToken = PasswordToken.create({
      token,
      expiration,
      userId: user.id.toString(),
    });

    await this.passwordTokensRepository.create(passwordToken);

    return right({
      token,
      expiration,
    });
  }
}
