import { Either, left, right } from "@/core/either";
import { HashGenerator } from "../cryptography/hash-generator";
import { UsersRepository } from "../repositories/users-repository";
import { User } from "../../enterprise/entities/user";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotAdminError } from "./errors/user-not-admin-error";
import { InvalidUserRoleError } from "./errors/invalid-user-role-error";

interface CreateUserUseCaseRequest {
  authenticateUserId: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

type CreateUserUseCaseResponse = Either<
  AlreadyExistsEmailError,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    authenticateUserId,
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const adminUser = await this.usersRepository.findById(authenticateUserId);

    if (!adminUser) {
      return left(new UserNotFoundError());
    }

    if (!adminUser.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new AlreadyExistsEmailError());
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return left(new InvalidUserRoleError());
    }

    const userRole = role as UserRole;

    const passwordHash = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: passwordHash,
      role: userRole,
      companyId: authenticateUserId,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
