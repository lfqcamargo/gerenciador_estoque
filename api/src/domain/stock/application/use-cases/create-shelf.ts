import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { ShelfsRepository } from "../repositories/shelfs-repository";

import { Shelf } from "../../enterprise/entities/shelf";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsShelfError } from "./errors/already-exists-shelf-error";

interface CreateShelfUseCaseRequest {
  authenticateId: string;
  name: string;
  active: boolean;
}

type CreateShelfUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | AlreadyExistsShelfError,
  { shelf: Shelf }
>;

@Injectable()
export class CreateShelfUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private shelfsRepository: ShelfsRepository
  ) {}

  async execute({
    authenticateId,
    name,
    active,
  }: CreateShelfUseCaseRequest): Promise<CreateShelfUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const existingShelf = await this.shelfsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (existingShelf) {
      return left(new AlreadyExistsShelfError());
    }

    const shelf = Shelf.create({
      companyId: user.companyId,
      name,
      active,
    });

    await this.shelfsRepository.create(shelf);

    return right({ shelf });
  }
}
