import { Either, left, right } from "@/core/either";
import { SubsLocationRepository } from "../repositories/subs-location-repository";
import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { Injectable } from "@nestjs/common";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { LocationsRepository } from "../repositories/locations-repository";
import { LocationNotFoundError } from "./errors/location-not-found-error";
import { SubLocation } from "../../enterprise/entities/sub-location";

interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
}

interface FetchSubsLocationUseCaseRequest extends PaginationParams {
  authenticatedId: string;
  locationId: string;
}

type FetchSubsLocationUseCaseResponse = Either<
  UserNotFoundError | LocationNotFoundError,
  {
    subslocation: SubLocation[] | null;
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
export class FetchSubsLocationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private locationsRepository: LocationsRepository,
    private subslocationRepository: SubsLocationRepository
  ) {}

  async execute({
    authenticatedId,
    locationId,
    page = 1,
    itemsPerPage = 20,
  }: FetchSubsLocationUseCaseRequest): Promise<FetchSubsLocationUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticatedId);
    if (!user) return left(new UserNotFoundError());

    const location = await this.locationsRepository.findById(locationId);
    if (!location) return left(new LocationNotFoundError());

    const result = await this.subslocationRepository.fetchAll(
      user.companyId.toString(),
      locationId,
      { page, itemsPerPage }
    );

    if (!result) {
      return right({
        subslocation: null,
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    return right({ subslocation: result?.data, meta: result?.meta });
  }
}
