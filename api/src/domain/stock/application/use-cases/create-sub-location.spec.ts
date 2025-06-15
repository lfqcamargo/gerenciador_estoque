import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryLocationsRepository } from "test/repositories/in-memory-locations-repository";
import { InMemorySubsLocationRepository } from "test/repositories/in-memory-subs-location-repository";

import { CreateSubLocationUseCase } from "./create-sub-location";

import { makeUser } from "test/factories/make-user";
import { makeLocation } from "test/factories/make-location";
import { makeSubLocation } from "test/factories/make-sub-location";

import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { LocationNotFoundError } from "./errors/location-not-found-error";
import { AlreadyExistsSubLocationError } from "./errors/already-exists-sub-location-error";

let usersRepository: InMemoryUsersRepository;
let locationsRepository: InMemoryLocationsRepository;
let subsLocationRepository: InMemorySubsLocationRepository;
let createSubLocation: CreateSubLocationUseCase;

describe("CreateSubLocationUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    locationsRepository = new InMemoryLocationsRepository();
    subsLocationRepository = new InMemorySubsLocationRepository();

    createSubLocation = new CreateSubLocationUseCase(
      usersRepository,
      locationsRepository,
      subsLocationRepository
    );
  });

  it("should create a sub-location when user is admin and location exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const result = await createSubLocation.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      name: "SubLocation A",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    expect(subsLocationRepository.items).toHaveLength(1);
    expect(subsLocationRepository.items[0].name).toBe("SubLocation A");
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await createSubLocation.execute({
      authenticateId: "non-existent-user-id",
      locationId: "any-location-id",
      name: "SubLocation X",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotAdminError if user is not admin", async () => {
    const user = makeUser({ role: UserRole.EMPLOYEE });
    await usersRepository.create(user);

    const result = await createSubLocation.execute({
      authenticateId: user.id.toString(),
      locationId: "any-location-id",
      name: "SubLocation Y",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return LocationNotFoundError if location does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const result = await createSubLocation.execute({
      authenticateId: user.id.toString(),
      locationId: "non-existent-location-id",
      name: "SubLocation Z",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LocationNotFoundError);
  });

  it("should return AlreadyExistsSubLocationError if sub-location with same name exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const existingSubLocation = makeSubLocation({
      companyId: user.companyId,
      locationId: location.id,
      name: "Duplicate SubLocation",
    });
    await subsLocationRepository.create(existingSubLocation);

    const result = await createSubLocation.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
      name: "Duplicate SubLocation",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsSubLocationError);
  });
});
