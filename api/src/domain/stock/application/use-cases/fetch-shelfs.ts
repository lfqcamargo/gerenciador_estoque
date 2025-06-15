import { Either, left, right } from "@/core/either";
import { Shelf } from "../../enterprise/entities/shelf";
import { ShelfsRepository } from "../repositories/shelfs-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchShelfsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchShelfsUseCaseResponse = Either<
  UserNotFoundError,
  {
    shelfs: Shelf[] | null;
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
export class FetchShelfsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private shelfsRepository: ShelfsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchShelfsUseCaseRequest): Promise<FetchShelfsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.shelfsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        shelfs: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ shelfs: result?.data, meta: result?.meta });
  }
}
