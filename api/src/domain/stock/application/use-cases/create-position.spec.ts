import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryPositionsRepository } from "test/repositories/in-memory-positions-repository";

import { CreatePositionUseCase } from "./create-position";
import { makeUser } from "test/factories/make-user";
import { makePosition } from "test/factories/make-position";

import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsPositionError } from "./errors/already-exists-position-error";

let usersRepository: InMemoryUsersRepository;
let positionsRepository: InMemoryPositionsRepository;
let createPosition: CreatePositionUseCase;

describe("Create Position Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    positionsRepository = new InMemoryPositionsRepository();

    createPosition = new CreatePositionUseCase(
      usersRepository,
      positionsRepository
    );
  });

  it("should create a position when user is admin", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const result = await createPosition.execute({
      authenticateId: user.id.toString(),
      name: "Supervisor",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    expect(positionsRepository.items).toHaveLength(1);
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await createPosition.execute({
      authenticateId: "non-existent-id",
      name: "Position X",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotAdminError if user is not admin", async () => {
    const user = makeUser({ role: UserRole.EMPLOYEE });
    await usersRepository.create(user);

    const result = await createPosition.execute({
      authenticateId: user.id.toString(),
      name: "Position Y",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return AlreadyExistsPositionError if position with same name exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const position = makePosition({
      companyId: user.companyId,
      name: "Duplicated Position",
    });

    await positionsRepository.create(position);

    const result = await createPosition.execute({
      authenticateId: user.id.toString(),
      name: "Duplicated Position",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsPositionError);
  });
});
