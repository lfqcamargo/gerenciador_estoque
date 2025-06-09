import { UsersRepository } from "../repositories/users-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { Either, left, right } from "@/core/either";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { TempUser } from "../../enterprise/entities/temp-user";
import { TempUsersRepository } from "../repositories/temp-users-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotAdminError } from "./errors/user-not-admin-error";

interface CreateTempUserUseCaseRequest {
  authenticateId: string;
  email: string;
  name: string;
  role: UserRole;
}

type CreateTempUserUseCaseResponse = Either<
  AlreadyExistsEmailError,
  { tempUser: TempUser }
>;

@Injectable()
export class CreateTempUserUseCase {
  constructor(
    private tempUsersRepository: TempUsersRepository,
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    authenticateId,
    email,
    name,
    role,
  }: CreateTempUserUseCaseRequest): Promise<CreateTempUserUseCaseResponse> {
    const authenticate = await this.usersRepository.findById(authenticateId);

    if (!authenticate) {
      return left(new UserNotFoundError());
    }

    if (authenticate.role !== UserRole.ADMIN) {
      return left(new UserNotAdminError());
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      return left(new AlreadyExistsEmailError());
    }

    const alreadyExists = await this.tempUsersRepository.findByEmail(email);

    if (alreadyExists) {
      await this.tempUsersRepository.delete(alreadyExists);
    }

    const token = new UniqueEntityID().toString();
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day

    const tempUser = TempUser.create({
      companyId: authenticate.companyId,
      email,
      name,
      userRole: role,
      token,
      expiration,
    });

    await this.tempUsersRepository.create(tempUser);

    return right({ tempUser });
  }
}
