import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { LocationsRepository } from "../repositories/locations-repository";

import { Location } from "../../enterprise/entities/location";

import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsLocationError } from "./errors/already-exists-location-error";

interface CreateLocationUseCaseRequest {
  authenticateId: string;
  name: string;
  active: boolean;
}

type CreateLocationUseCaseResponse = Either<
  UserNotFoundError | UserNotAdminError | AlreadyExistsLocationError,
  { location: Location }
>;

@Injectable()
export class CreateLocationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private locationsRepository: LocationsRepository
  ) {}

  async execute({
    authenticateId,
    name,
    active,
  }: CreateLocationUseCaseRequest): Promise<CreateLocationUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError());
    }

    const existingLocation = await this.locationsRepository.findByName(
      user.companyId.toString(),
      name
    );

    if (existingLocation) {
      return left(new AlreadyExistsLocationError());
    }

    const location = Location.create({
      companyId: user.companyId,
      name,
      active,
    });

    await this.locationsRepository.create(location);

    return right({ location });
  }
}
