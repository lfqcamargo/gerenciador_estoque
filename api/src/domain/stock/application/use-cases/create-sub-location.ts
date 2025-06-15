import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { SubsLocationRepository } from "../repositories/subs-location-repository";
import { LocationsRepository } from "../repositories/locations-repository";

import { SubLocation } from "../../enterprise/entities/sub-location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsSubLocationError } from "./errors/already-exists-sub-location-error";
import { LocationNotFoundError } from "./errors/location-not-found-error";

interface CreateSubLocationUseCaseRequest {
  authenticateId: string;
  locationId: string;
  name: string;
  active: boolean;
}

type CreateSubLocationUseCaseResponse = Either<
  | UserNotFoundError
  | UserNotAdminError
  | AlreadyExistsSubLocationError
  | LocationNotFoundError,
  { subLocation: SubLocation }
>;

@Injectable()
export class CreateSubLocationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private locationsRepository: LocationsRepository,
    private subsLocationRepository: SubsLocationRepository
  ) {}

  async execute({
    authenticateId,
    locationId,
    name,
    active,
  }: CreateSubLocationUseCaseRequest): Promise<CreateSubLocationUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const location = await this.locationsRepository.findById(locationId);
    if (!location) {
      return left(new LocationNotFoundError());
    }

    const existing = await this.subsLocationRepository.findByName(
      user.companyId.toString(),
      locationId,
      name
    );

    if (existing) {
      return left(new AlreadyExistsSubLocationError());
    }

    const subLocation = SubLocation.create({
      companyId: user.companyId,
      locationId: location.id,
      name,
      active,
    });

    await this.subsLocationRepository.create(subLocation);

    return right({ subLocation });
  }
}
