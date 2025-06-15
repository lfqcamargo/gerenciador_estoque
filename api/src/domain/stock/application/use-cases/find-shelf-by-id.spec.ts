import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryShelfsRepository } from "test/repositories/in-memory-shelfs-repository";
import { FindShelfByIdUseCase } from "@/domain/stock/application/use-cases/find-shelf-by-id";
import { makeUser } from "test/factories/make-user";
import { makeShelf } from "test/factories/make-shelf";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { ShelfNotFoundError } from "@/domain/stock/application/use-cases/errors/shelf-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindShelfUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let shelfsRepository: InMemoryShelfsRepository;
  let findShelf: FindShelfByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    shelfsRepository = new InMemoryShelfsRepository();
    findShelf = new FindShelfByIdUseCase(usersRepository, shelfsRepository);
  });

  it("should be able to find a shelf", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const shelf = makeShelf({ companyId: user.companyId });
    await shelfsRepository.create(shelf);

    const result = await findShelf.execute({
      authenticateId: user.id.toString(),
      shelfId: shelf.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ shelf });
  });

  it("should return error if user does not exist", async () => {
    const result = await findShelf.execute({
      authenticateId: "non-existent",
      shelfId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if shelf does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findShelf.execute({
      authenticateId: user.id.toString(),
      shelfId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ShelfNotFoundError);
  });

  it("should return error if shelf does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherShelf = makeShelf();
    await shelfsRepository.create(otherShelf);

    const result = await findShelf.execute({
      authenticateId: user.id.toString(),
      shelfId: otherShelf.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
