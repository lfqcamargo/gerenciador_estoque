import { describe, it, expect, beforeEach } from "vitest";
import { FetchAddressingsUseCase } from "./fetch-addressings";
import { InMemoryAddressingsRepository } from "test/repositories/in-memory-addressings-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeAddressing } from "test/factories/make-addressing";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAddressingsRepository: InMemoryAddressingsRepository;
let sut: FetchAddressingsUseCase;

describe("FetchAddressingsUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAddressingsRepository = new InMemoryAddressingsRepository();
    sut = new FetchAddressingsUseCase(
      inMemoryUsersRepository,
      inMemoryAddressingsRepository
    );
  });

  it("should paginate addressings and return correct meta data", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const totalAddressings = 25;
    const itemsPerPage = 10;
    const page = 2;

    for (let i = 0; i < totalAddressings; i++) {
      await inMemoryAddressingsRepository.create(
        makeAddressing({ companyId: user.companyId })
      );
    }

    const result = await sut.execute({
      authenticatedId: user.id.toString(),
      page,
      itemsPerPage,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { addressings, meta } = result.value;

      expect(addressings).toHaveLength(itemsPerPage);

      expect(meta.totalItems).toBe(totalAddressings);
      expect(meta.itemsPerPage).toBe(itemsPerPage);
      expect(meta.currentPage).toBe(page);
      expect(meta.totalPages).toBe(Math.ceil(totalAddressings / itemsPerPage));
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
