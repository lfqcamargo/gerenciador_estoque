import { describe, it, expect, beforeEach } from "vitest";
import { FetchGroupsUseCase } from "./fetch-groups";
import { InMemoryGroupsRepository } from "test/repositories/in-memory-groups-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeGroup } from "test/factories/make-group";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGroupsRepository: InMemoryGroupsRepository;
let sut: FetchGroupsUseCase;

describe("FetchGroupsUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGroupsRepository = new InMemoryGroupsRepository();
    sut = new FetchGroupsUseCase(
      inMemoryUsersRepository,
      inMemoryGroupsRepository
    );
  });

  it("should paginate groups and return correct meta data", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const totalGroups = 25;
    const itemsPerPage = 10;
    const page = 2;

    for (let i = 0; i < totalGroups; i++) {
      await inMemoryGroupsRepository.create(
        makeGroup({ companyId: user.companyId })
      );
    }

    const result = await sut.execute({
      authenticatedId: user.id.toString(),
      page,
      itemsPerPage,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { groups, meta } = result.value;

      expect(groups).toHaveLength(itemsPerPage);

      expect(meta.totalItems).toBe(totalGroups);
      expect(meta.itemsPerPage).toBe(itemsPerPage);
      expect(meta.currentPage).toBe(page);
      expect(meta.totalPages).toBe(Math.ceil(totalGroups / itemsPerPage));
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
