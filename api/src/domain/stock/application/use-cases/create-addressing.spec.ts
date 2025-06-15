import { beforeEach, describe, expect, it } from "vitest";

import { CreateAddressingUseCase } from "./create-addressing";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryLocationsRepository } from "test/repositories/in-memory-locations-repository";
import { InMemorySubsLocationRepository } from "test/repositories/in-memory-subs-location-repository";
import { InMemoryRowsRepository } from "test/repositories/in-memory-rows-repository";
import { InMemoryShelfsRepository } from "test/repositories/in-memory-shelfs-repository";
import { InMemoryPositionsRepository } from "test/repositories/in-memory-positions-repository";
import { InMemoryMaterialsRepository } from "test/repositories/in-memory-materials-repository";
import { InMemoryAddressingsRepository } from "test/repositories/in-memory-addressings-repository";

import { makeUser } from "test/factories/make-user";
import { makeLocation } from "test/factories/make-location";
import { makeSubLocation } from "test/factories/make-sub-location";
import { makeRow } from "test/factories/make-row";
import { makeShelf } from "test/factories/make-shelf";
import { makePosition } from "test/factories/make-position";
import { makeMaterial } from "test/factories/make-material";

import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { LocationNotFoundError } from "./errors/location-not-found-error";
import { SubLocationNotFoundError } from "./errors/sub-location-not-found-error";
import { RowNotFoundError } from "./errors/row-not-found-error";
import { ShelfNotFoundError } from "./errors/shelf-not-found-error";
import { PositionNotFoundError } from "./errors/position-not-found-error";
import { MaterialNotFoundError } from "./errors/material-not-found-error";

let usersRepository: InMemoryUsersRepository;
let locationsRepository: InMemoryLocationsRepository;
let subsLocationRepository: InMemorySubsLocationRepository;
let rowsRepository: InMemoryRowsRepository;
let shelfsRepository: InMemoryShelfsRepository;
let positionsRepository: InMemoryPositionsRepository;
let materialsRepository: InMemoryMaterialsRepository;
let addressingsRepository: InMemoryAddressingsRepository;
let createAddressing: CreateAddressingUseCase;

describe("Create Addressing Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    locationsRepository = new InMemoryLocationsRepository();
    subsLocationRepository = new InMemorySubsLocationRepository();
    rowsRepository = new InMemoryRowsRepository();
    shelfsRepository = new InMemoryShelfsRepository();
    positionsRepository = new InMemoryPositionsRepository();
    materialsRepository = new InMemoryMaterialsRepository();
    addressingsRepository = new InMemoryAddressingsRepository();

    createAddressing = new CreateAddressingUseCase(
      usersRepository,
      locationsRepository,
      subsLocationRepository,
      rowsRepository,
      shelfsRepository,
      positionsRepository,
      materialsRepository,
      addressingsRepository
    );
  });

  it("should create an addressing when all entities exist and user is admin", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    const subLocation = makeSubLocation({ companyId: user.companyId });
    const row = makeRow({ companyId: user.companyId });
    const shelf = makeShelf({ companyId: user.companyId });
    const position = makePosition({ companyId: user.companyId });
    const material = makeMaterial({ companyId: user.companyId });

    await locationsRepository.create(location);
    await subsLocationRepository.create(subLocation);
    await rowsRepository.create(row);
    await shelfsRepository.create(shelf);
    await positionsRepository.create(position);
    await materialsRepository.create(material);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      subLocationId: subLocation.id.toString(),
      rowId: row.id.toString(),
      shelfId: shelf.id.toString(),
      positionId: position.id.toString(),
      materialId: material.id.toString(),
      amount: 50,
      active: true,
    });

    expect(result.isRight()).toBe(true);
    expect(addressingsRepository.items).toHaveLength(1);
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await createAddressing.execute({
      authenticateId: "non-existent",
      locationId: "any",
      subLocationId: "any",
      rowId: "any",
      shelfId: "any",
      positionId: "any",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotAdminError if user is not admin", async () => {
    const user = makeUser({ role: UserRole.EMPLOYEE });
    await usersRepository.create(user);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: "any",
      subLocationId: "any",
      rowId: "any",
      shelfId: "any",
      positionId: "any",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return LocationNotFoundError if location does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: "non-existent",
      subLocationId: "any",
      rowId: "any",
      shelfId: "any",
      positionId: "any",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LocationNotFoundError);
  });

  it("should return SubLocationNotFoundError if subLocation does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      subLocationId: "non-existent",
      rowId: "any",
      shelfId: "any",
      positionId: "any",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SubLocationNotFoundError);
  });

  it("should return RowNotFoundError if row does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const subLocation = makeSubLocation({
      companyId: user.companyId,
      locationId: location.id,
    });
    await subsLocationRepository.create(subLocation);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      subLocationId: subLocation.id.toString(),
      rowId: "non-existent",
      shelfId: "any",
      positionId: "any",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RowNotFoundError);
  });

  it("should return ShelfNotFoundError if shelf does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const subLocation = makeSubLocation({
      companyId: user.companyId,
      locationId: location.id,
    });
    await subsLocationRepository.create(subLocation);

    const row = makeRow({ companyId: user.companyId });
    await rowsRepository.create(row);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      subLocationId: subLocation.id.toString(),
      rowId: row.id.toString(),
      shelfId: "non-existent",
      positionId: "any",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ShelfNotFoundError);
  });

  it("should return PositionNotFoundError if position does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const subLocation = makeSubLocation({
      companyId: user.companyId,
      locationId: location.id,
    });
    await subsLocationRepository.create(subLocation);

    const row = makeRow({ companyId: user.companyId });
    await rowsRepository.create(row);

    const shelf = makeShelf({ companyId: user.companyId });
    await shelfsRepository.create(shelf);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      subLocationId: subLocation.id.toString(),
      rowId: row.id.toString(),
      shelfId: shelf.id.toString(),
      positionId: "non-existent",
      materialId: "any",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PositionNotFoundError);
  });

  it("should return MaterialNotFoundError if material does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const subLocation = makeSubLocation({
      companyId: user.companyId,
      locationId: location.id,
    });
    await subsLocationRepository.create(subLocation);

    const row = makeRow({ companyId: user.companyId });
    await rowsRepository.create(row);

    const shelf = makeShelf({ companyId: user.companyId });
    await shelfsRepository.create(shelf);

    const position = makePosition({ companyId: user.companyId });
    await positionsRepository.create(position);

    const result = await createAddressing.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      subLocationId: subLocation.id.toString(),
      rowId: row.id.toString(),
      shelfId: shelf.id.toString(),
      positionId: position.id.toString(),
      materialId: "non-existent",
      amount: 10,
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(MaterialNotFoundError);
  });
});
