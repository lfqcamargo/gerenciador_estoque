import { UsersRepository } from "../repositories/users-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { Either, left, right } from "@/core/either";
import { WrongCredentialsError } from "@/domain/user/application/use-cases/errors/wrong-credentials-error";
import { Injectable } from "@nestjs/common";

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

type AuthenticateUserResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      role: user.role,
    });

    return right({
      accessToken,
    });
  }
}
