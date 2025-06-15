import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { ShelfsRepository } from "../repositories/shelfs-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Shelf } from "../../enterprise/entities/shelf";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { ShelfNotFoundError } from "./errors/shelf-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindShelfUseCaseRequest {
  authenticateId: string;
  shelfId: string;
}

type FindShelfUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | ShelfNotFoundError,
  { shelf: Shelf }
>;

@Injectable()
export class FindShelfByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private shelfsRepository: ShelfsRepository
  ) {}

  async execute({
    authenticateId,
    shelfId,
  }: FindShelfUseCaseRequest): Promise<FindShelfUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const shelf = await this.shelfsRepository.findById(shelfId);
    if (!shelf) return left(new ShelfNotFoundError());

    if (shelf.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ shelf: shelf });
  }
}
