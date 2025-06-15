import { describe, it, expect, beforeEach } from "vitest";
import { FetchShelfsUseCase } from "./fetch-shelfs";
import { InMemoryShelfsRepository } from "test/repositories/in-memory-shelfs-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeShelf } from "test/factories/make-shelf";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryShelfsRepository: InMemoryShelfsRepository;
let sut: FetchShelfsUseCase;

describe("FetchShelfsUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryShelfsRepository = new InMemoryShelfsRepository();
    sut = new FetchShelfsUseCase(
      inMemoryUsersRepository,
      inMemoryShelfsRepository
    );
  });

  it("should paginate shelfs and return correct meta data", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const totalShelfs = 25;
    const itemsPerPage = 10;
    const page = 2;

    for (let i = 0; i < totalShelfs; i++) {
      await inMemoryShelfsRepository.create(
        makeShelf({ companyId: user.companyId })
      );
    }

    const result = await sut.execute({
      authenticatedId: user.id.toString(),
      page,
      itemsPerPage,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { shelfs, meta } = result.value;

      expect(shelfs).toHaveLength(itemsPerPage);

      expect(meta.totalItems).toBe(totalShelfs);
      expect(meta.itemsPerPage).toBe(itemsPerPage);
      expect(meta.currentPage).toBe(page);
      expect(meta.totalPages).toBe(Math.ceil(totalShelfs / itemsPerPage));
      expect(meta.itemCount).toBe(itemsPerPage);
    }
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await sut.execute({
      authenticatedId: "non-existent-user-id",
      page: 1,
      itemsPerPage: 10,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
