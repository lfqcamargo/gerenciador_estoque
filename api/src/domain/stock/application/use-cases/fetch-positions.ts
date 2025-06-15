import { Either, left, right } from "@/core/either";
import { Position } from "../../enterprise/entities/position";
import { PositionsRepository } from "../repositories/positions-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchPositionsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchPositionsUseCaseResponse = Either<
  UserNotFoundError,
  {
    positions: Position[] | null;
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
export class FetchPositionsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private positionsRepository: PositionsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchPositionsUseCaseRequest): Promise<FetchPositionsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.positionsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        positions: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ positions: result?.data, meta: result?.meta });
  }
}
