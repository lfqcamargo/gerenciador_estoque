import { describe, it, expect, beforeEach } from "vitest";
import { FetchLocationsUseCase } from "./fetch-locations";
import { InMemoryLocationsRepository } from "test/repositories/in-memory-locations-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeLocation } from "test/factories/make-location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLocationsRepository: InMemoryLocationsRepository;
let sut: FetchLocationsUseCase;

describe("FetchLocationsUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryLocationsRepository = new InMemoryLocationsRepository();
    sut = new FetchLocationsUseCase(
      inMemoryUsersRepository,
      inMemoryLocationsRepository
    );
  });

  it("should paginate locations and return correct meta data", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const totalLocations = 25;
    const itemsPerPage = 10;
    const page = 2;

    for (let i = 0; i < totalLocations; i++) {
      await inMemoryLocationsRepository.create(
        makeLocation({ companyId: user.companyId })
      );
    }

    const result = await sut.execute({
      authenticatedId: user.id.toString(),
      page,
      itemsPerPage,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { locations, meta } = result.value;

      expect(locations).toHaveLength(itemsPerPage);

      expect(meta.totalItems).toBe(totalLocations);
      expect(meta.itemsPerPage).toBe(itemsPerPage);
      expect(meta.currentPage).toBe(page);
      expect(meta.totalPages).toBe(Math.ceil(totalLocations / itemsPerPage));
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
