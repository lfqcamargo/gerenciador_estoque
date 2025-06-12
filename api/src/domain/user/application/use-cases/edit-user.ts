import { Company } from "@/domain/user/enterprise/entities/company";
import { CompaniesRepository } from "../repositories/companies-repository";
import { UsersRepository } from "../repositories/users-repository";
import { CompanyNotFoundError } from "./errors/company-not-found-error";
import { Either, left, right } from "@/core/either";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { User, UserRole } from "../../enterprise/entities/user";
import { UserNotAdminError } from "./errors/user-not-admin-error";
import { Injectable } from "@nestjs/common";
import { UserNotBelongToCompanyError } from "./errors/user-not-belong-to-company-error";

interface EditUserUseCaseRequest {
  userId: string;
  authenticateUserId: string;
  name: string;
  role: UserRole;
  active: boolean;
  photoId: string | null;
}

type EditUserUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | UserNotBelongToCompanyError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    authenticateUserId,
    name,
    role,
    active,
    photoId,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (userId !== authenticateUserId) {
      const authenticatedUser =
        await this.usersRepository.findById(authenticateUserId);

      if (!authenticatedUser) {
        return left(new UserNotFoundError());
      }

      if (authenticatedUser.role !== UserRole.ADMIN) {
        return left(new UserNotAdminError());
      }

      user.role = role; //Somente outros usuários podem trocar a função do usuário
      user.active = active; //Somente outros usuários podem ativar/desativar o usuário
    }

    user.name = name;
    user.photoId = photoId;

    await this.usersRepository.update(user);

    return right({ user });
  }
}
