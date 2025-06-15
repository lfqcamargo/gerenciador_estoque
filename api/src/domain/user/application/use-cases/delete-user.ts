import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../repositories/users-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotAdminError } from "./errors/user-not-admin-error";
import { Injectable } from "@nestjs/common";
import { UserRole } from "../../enterprise/entities/user";
import { UserNotBelongToCompanyError } from "./errors/user-not-belong-to-company-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface DeleteUserUseCaseRequest {
  userId: string;
  authenticatedUserId: string;
}

type DeleteUserUseCaseResponse = Either<
  | UserNotFoundError
  | UserNotAdminError
  | UserNotBelongToCompanyError
  | NotAllowedError,
  null
>;

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    authenticatedUserId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    if (userId === authenticatedUserId) {
      return left(new NotAllowedError());
    }

    const targetUser = await this.usersRepository.findById(userId);

    if (!targetUser) {
      return left(new UserNotFoundError());
    }

    const authenticatedUser =
      await this.usersRepository.findById(authenticatedUserId);
    if (!authenticatedUser) {
      return left(new UserNotFoundError());
    }

    if (authenticatedUser.role !== UserRole.ADMIN) {
      return left(new UserNotAdminError());
    }

    if (
      authenticatedUser.companyId.toString() !== targetUser.companyId.toString()
    ) {
      return left(new UserNotBelongToCompanyError());
    }

    targetUser.deletedAt = new Date();

    await this.usersRepository.delete(targetUser);
    return right(null);
  }
}
