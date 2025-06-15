import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { RowsRepository } from "../repositories/rows-repository";

import { Row } from "../../enterprise/entities/row";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsRowError } from "./errors/already-exists-row-error";

interface CreateRowUseCaseRequest {
  authenticateId: string;
  name: string;
  active: boolean;
}

type CreateRowUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | AlreadyExistsRowError,
  { row: Row }
>;

@Injectable()
export class CreateRowUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private rowsRepository: RowsRepository
  ) {}

  async execute({
    authenticateId,
    name,
    active,
  }: CreateRowUseCaseRequest): Promise<CreateRowUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const existingRow = await this.rowsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (existingRow) {
      return left(new AlreadyExistsRowError());
    }

    const row = Row.create({
      companyId: user.companyId,
      name,
      active,
    });

    await this.rowsRepository.create(row);

    return right({ row });
  }
}
