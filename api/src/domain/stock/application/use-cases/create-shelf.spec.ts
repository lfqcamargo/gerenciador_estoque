import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryShelfsRepository } from "test/repositories/in-memory-shelfs-repository";

import { CreateShelfUseCase } from "./create-shelf";
import { makeUser } from "test/factories/make-user";
import { makeShelf } from "test/factories/make-shelf";

import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsShelfError } from "./errors/already-exists-shelf-error";

let usersRepository: InMemoryUsersRepository;
let shelfsRepository: InMemoryShelfsRepository;
let createShelf: CreateShelfUseCase;

describe("CreateShelfUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    shelfsRepository = new InMemoryShelfsRepository();

    createShelf = new CreateShelfUseCase(usersRepository, shelfsRepository);
  });

  it("should create a shelf when user is admin and shelf does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const result = await createShelf.execute({
      authenticateId: user.id.toString(),
      name: "Shelf A",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    expect(shelfsRepository.items).toHaveLength(1);
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await createShelf.execute({
      authenticateId: "non-existent-id",
      name: "Shelf X",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotAdminError if user is not admin", async () => {
    const user = makeUser({ role: UserRole.EMPLOYEE });
    await usersRepository.create(user);

    const result = await createShelf.execute({
      authenticateId: user.id.toString(),
      name: "Shelf Y",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return AlreadyExistsShelfError if shelf with same name exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const shelf = makeShelf({
      companyId: user.companyId,
      name: "Duplicate Shelf",
    });
    await shelfsRepository.create(shelf);

    const result = await createShelf.execute({
      authenticateId: user.id.toString(),
      name: "Duplicate Shelf",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsShelfError);
  });
});
