import { Either, left, right } from "@/core/either";
import { HashGenerator } from "../cryptography/hash-generator";
import { PasswordTokensRepository } from "../repositories/password-tokens-repository";
import { UsersRepository } from "../repositories/users-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { HashComparer } from "../cryptography/hash-comparer";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";
import { TokenExpiratedError } from "./errors/token-expirated-error";
import { Injectable } from "@nestjs/common";

interface ExchangePasswordForTokenUseCaseRequest {
  token: string;
  password: string;
}

type ExchangePasswordForTokenUseCaseResult = Either<
  ResourceTokenNotFoundError | UserNotFoundError | TokenExpiratedError,
  {}
>;

@Injectable()
export class ExchangePasswordForTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordTokensRepository: PasswordTokensRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    token,
    password,
  }: ExchangePasswordForTokenUseCaseRequest): Promise<ExchangePasswordForTokenUseCaseResult> {
    const passwordToken =
      await this.passwordTokensRepository.findByToken(token);
    if (!passwordToken) {
      return left(new ResourceTokenNotFoundError());
    }

    const user = await this.usersRepository.findById(
      passwordToken.userId.toString()
    );

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (passwordToken.expiration < new Date()) {
      return left(new TokenExpiratedError());
    }

    const passwordHash = await this.hashGenerator.hash(password);

    user.password = passwordHash;

    await this.usersRepository.update(user);

    return right({});
  }
}
