import { Either, left, right } from "@/core/either";
import { Row } from "../../enterprise/entities/row";
import { RowsRepository } from "../repositories/rows-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchRowsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchRowsUseCaseResponse = Either<
  UserNotFoundError,
  {
    rows: Row[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }
>;

@Injectable()
export class FetchRowsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private rowsRepository: RowsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchRowsUseCaseRequest): Promise<FetchRowsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.rowsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        rows: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ rows: result?.data, meta: result?.meta });
  }
}
