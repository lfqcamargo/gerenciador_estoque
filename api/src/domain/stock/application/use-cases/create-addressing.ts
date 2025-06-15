import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";

import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { LocationsRepository } from "../repositories/locations-repository";
import { SubsLocationRepository } from "../repositories/subs-location-repository";
import { RowsRepository } from "../repositories/rows-repository";
import { ShelfsRepository } from "../repositories/shelfs-repository";
import { PositionsRepository } from "../repositories/positions-repository";
import { MaterialsRepository } from "../repositories/materials-repository";
import { AddressingsRepository } from "../repositories/addressings-repository";

import { Addressing } from "../../enterprise/entities/addressing";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { LocationNotFoundError } from "./errors/location-not-found-error";
import { SubLocationNotFoundError } from "./errors/sub-location-not-found-error";
import { RowNotFoundError } from "./errors/row-not-found-error";
import { ShelfNotFoundError } from "./errors/shelf-not-found-error";
import { PositionNotFoundError } from "./errors/position-not-found-error";
import { MaterialNotFoundError } from "./errors/material-not-found-error";

interface CreateAddressingUseCaseRequest {
  authenticateId: string;
  locationId: string;
  subLocationId: string;
  rowId: string;
  shelfId: string;
  positionId: string;
  materialId: string;
  amount: number;
  active: boolean;
}

type CreateAddressingUseCaseResponse = Either<
  | UserNotFoundError
  | UserNotAdminError
  | LocationNotFoundError
  | SubLocationNotFoundError
  | RowNotFoundError
  | ShelfNotFoundError
  | PositionNotFoundError
  | MaterialNotFoundError,
  { addressing: Addressing }
>;

@Injectable()
export class CreateAddressingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private locationsRepository: LocationsRepository,
    private subsLocationRepository: SubsLocationRepository,
    private rowsRepository: RowsRepository,
    private shelfsRepository: ShelfsRepository,
    private positionsRepository: PositionsRepository,
    private materialsRepository: MaterialsRepository,
    private addressingsRepository: AddressingsRepository
  ) {}

  async execute({
    authenticateId,
    locationId,
    subLocationId,
    rowId,
    shelfId,
    positionId,
    materialId,
    amount,
    active,
  }: CreateAddressingUseCaseRequest): Promise<CreateAddressingUseCaseResponse> {
    const user = await this.usersRepository.findById(authenticateId);
    if (!user) return left(new UserNotFoundError());
    if (!user.isAdmin()) return left(new UserNotAdminError());

    const [location, subLocation, row, shelf, position, material] =
      await Promise.all([
        this.locationsRepository.findById(locationId),
        this.subsLocationRepository.findById(subLocationId),
        this.rowsRepository.findById(rowId),
        this.shelfsRepository.findById(shelfId),
        this.positionsRepository.findById(positionId),
        this.materialsRepository.findById(materialId),
      ]);

    if (!location) return left(new LocationNotFoundError());
    if (!subLocation) return left(new SubLocationNotFoundError());
    if (!row) return left(new RowNotFoundError());
    if (!shelf) return left(new ShelfNotFoundError());
    if (!position) return left(new PositionNotFoundError());
    if (!material) return left(new MaterialNotFoundError());

    const addressing = Addressing.create({
      companyId: user.companyId,
      locationId: location.id,
      subLocationId: subLocation.id,
      rowId: row.id,
      shelfId: shelf.id,
      positionId: position.id,
      materialId: material.id,
      amount,
      active,
    });

    await this.addressingsRepository.create(addressing);

    return right({ addressing });
  }
}
