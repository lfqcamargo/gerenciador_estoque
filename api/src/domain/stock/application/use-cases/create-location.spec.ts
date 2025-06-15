import { describe, it, beforeEach, expect } from "vitest";

import { CreateLocationUseCase } from "./create-location";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryLocationsRepository } from "test/repositories/in-memory-locations-repository";
import { makeUser } from "test/factories/make-user";
import { Location } from "../../enterprise/entities/location";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { AlreadyExistsLocationError } from "./errors/already-exists-location-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLocationsRepository: InMemoryLocationsRepository;
let createLocationUseCase: CreateLocationUseCase;

describe("CreateLocationUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryLocationsRepository = new InMemoryLocationsRepository();
    createLocationUseCase = new CreateLocationUseCase(
      inMemoryUsersRepository,
      inMemoryLocationsRepository
    );
  });

  it("should be able to create a location", async () => {
    const adminUser = makeUser({ role: UserRole.ADMIN });
    await inMemoryUsersRepository.create(adminUser);

    const result = await createLocationUseCase.execute({
      authenticateId: adminUser.id.toString(),
      name: "Galpão Central",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.location).toBeInstanceOf(Location);
      expect(result.value.location.name).toBe("Galpão Central");
      expect(result.value.location.companyId.toString()).toBe(
        adminUser.companyId.toString()
      );
    }
  });

  it("should not create a location if user does not exist", async () => {
    const result = await createLocationUseCase.execute({
      authenticateId: "non-existent-user-id",
      name: "Galpão X",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not create a location if user is not admin", async () => {
    const employeeUser = makeUser({ role: UserRole.EMPLOYEE });
    await inMemoryUsersRepository.create(employeeUser);

    const result = await createLocationUseCase.execute({
      authenticateId: employeeUser.id.toString(),
      name: "Galpão Y",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should not create a location with duplicated name in the same company", async () => {
    const adminUser = makeUser({ role: UserRole.ADMIN });
    await inMemoryUsersRepository.create(adminUser);

    await createLocationUseCase.execute({
      authenticateId: adminUser.id.toString(),
      name: "Galpão Z",
      active: true,
    });

    const result = await createLocationUseCase.execute({
      authenticateId: adminUser.id.toString(),
      name: "Galpão Z",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsLocationError);
  });
});
