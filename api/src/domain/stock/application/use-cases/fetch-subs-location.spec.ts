import { describe, it, expect, beforeEach } from "vitest";
import { FetchSubsLocationUseCase } from "./fetch-subs-location";
import { InMemorySubsLocationRepository } from "test/repositories/in-memory-subs-location-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeSubLocation } from "test/factories/make-sub-location";
import { InMemoryLocationsRepository } from "test/repositories/in-memory-locations-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeLocation } from "test/factories/make-location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { LocationNotFoundError } from "./errors/location-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLocationsRepository: InMemoryLocationsRepository;
let inMemorySubsLocationRepository: InMemorySubsLocationRepository;
let sut: FetchSubsLocationUseCase;

describe("FetchSubsLocationUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryLocationsRepository = new InMemoryLocationsRepository();
    inMemorySubsLocationRepository = new InMemorySubsLocationRepository();

    sut = new FetchSubsLocationUseCase(
      inMemoryUsersRepository,
      inMemoryLocationsRepository,
      inMemorySubsLocationRepository
    );
  });

  it("should paginate subslocation and return correct meta data", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await inMemoryLocationsRepository.create(location);

    const totalSubsLocation = 25;
    const itemsPerPage = 10;
    const page = 2;

    for (let i = 0; i < totalSubsLocation; i++) {
      await inMemorySubsLocationRepository.create(
        makeSubLocation({
          companyId: user.companyId,
          locationId: location.id,
        })
      );
    }

    const result = await sut.execute({
      authenticatedId: user.id.toString(),
      locationId: location.id.toString(),
      page,
      itemsPerPage,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { subslocation, meta } = result.value;

      expect(subslocation).toHaveLength(itemsPerPage);

      expect(meta.totalItems).toBe(totalSubsLocation);
      expect(meta.itemsPerPage).toBe(itemsPerPage);
      expect(meta.currentPage).toBe(page);
      expect(meta.totalPages).toBe(Math.ceil(totalSubsLocation / itemsPerPage));
      expect(meta.itemCount).toBe(itemsPerPage);
    }
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const location = makeLocation();
    await inMemoryLocationsRepository.create(location);

    const result = await sut.execute({
      authenticatedId: "non-existent-user-id",
      locationId: location.id.toString(),
      page: 1,
      itemsPerPage: 10,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return LocationNotFoundError if user does not exist", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      authenticatedId: user.id.toString(),
      locationId: "teste",
      page: 1,
      itemsPerPage: 10,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LocationNotFoundError);
  });
});
