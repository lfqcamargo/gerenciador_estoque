import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { LocationsRepository } from "../repositories/locations-repository";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { Location } from "../../enterprise/entities/location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { LocationNotFoundError } from "./errors/location-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

interface FindLocationUseCaseRequest {
  authenticateId: string;
  locationId: string;
}

type FindLocationUseCaseResponse = Either<
  UserNotFoundError | UserNotBelongToCompanyError | LocationNotFoundError,
  { location: Location }
>;

@Injectable()
export class FindLocationByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private locationsRepository: LocationsRepository
  ) {}

  async execute({
    authenticateId,
    locationId,
  }: FindLocationUseCaseRequest): Promise<FindLocationUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());

    const location = await this.locationsRepository.findById(locationId);
    if (!location) return left(new LocationNotFoundError());

    if (location.companyId.toString() !== user.companyId.toString()) {
      return left(new UserNotBelongToCompanyError());
    }

    return right({ location: location });
  }
}
