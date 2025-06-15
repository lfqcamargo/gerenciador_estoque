import { Either, left, right } from "@/core/either";
import { Location } from "../../enterprise/entities/location";
import { LocationsRepository } from "../repositories/locations-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchLocationsUseCaseRequest extends PaginationParams {
  authenticatedId: string;
}

type FetchLocationsUseCaseResponse = Either<
  UserNotFoundError,
  {
    locations: Location[] | null;
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
export class FetchLocationsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private locationsRepository: LocationsRepository
  ) {}

  async execute({
    authenticatedId,
    page = 1,
    itemsPerPage = 20,
  }: FetchLocationsUseCaseRequest): Promise<FetchLocationsUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const result = await this.locationsRepository.fetchAll(
      user.companyId.toString(),
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        locations: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ locations: result?.data, meta: result?.meta });
  }
}
