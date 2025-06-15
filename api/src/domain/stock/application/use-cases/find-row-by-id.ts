import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { RowsRepository } from "../repositories/rows-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Row } from "../../enterprise/entities/row";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { RowNotFoundError } from "./errors/row-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindRowUseCaseRequest {
  authenticateId: string;
  rowId: string;
}

type FindRowUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | RowNotFoundError,
  { row: Row }
>;

@Injectable()
export class FindRowByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private rowsRepository: RowsRepository
  ) {}

  async execute({
    authenticateId,
    rowId,
  }: FindRowUseCaseRequest): Promise<FindRowUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const row = await this.rowsRepository.findById(rowId);
    if (!row) return left(new RowNotFoundError());

    if (row.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ row: row });
  }
}
