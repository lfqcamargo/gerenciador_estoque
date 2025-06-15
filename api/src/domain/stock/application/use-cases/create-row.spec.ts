import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryRowsRepository } from "test/repositories/in-memory-rows-repository";

import { CreateRowUseCase } from "./create-row";
import { makeUser } from "test/factories/make-user";
import { makeRow } from "test/factories/make-row";

import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsRowError } from "./errors/already-exists-row-error";

let usersRepository: InMemoryUsersRepository;
let rowsRepository: InMemoryRowsRepository;
let createRow: CreateRowUseCase;

describe("Create Row Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    rowsRepository = new InMemoryRowsRepository();

    createRow = new CreateRowUseCase(usersRepository, rowsRepository);
  });

  it("should create a row when user is admin and name is unique", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const result = await createRow.execute({
      authenticateId: user.id.toString(),
      name: "Row A",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    expect(rowsRepository.items).toHaveLength(1);
    expect(rowsRepository.items[0].name).toBe("Row A");
    expect(rowsRepository.items[0].active).toBe(true);
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await createRow.execute({
      authenticateId: "non-existent-id",
      name: "Row X",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotAdminError if user is not admin", async () => {
    const user = makeUser({ role: UserRole.EMPLOYEE });
    await usersRepository.create(user);

    const result = await createRow.execute({
      authenticateId: user.id.toString(),
      name: "Row Y",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return AlreadyExistsRowError if row with same name exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const existingRow = makeRow({
      companyId: user.companyId,
      name: "Duplicate Row",
    });
    await rowsRepository.create(existingRow);

    const result = await createRow.execute({
      authenticateId: user.id.toString(),
      name: "Duplicate Row",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsRowError);
  });
});
