import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryGroupsRepository } from "test/repositories/in-memory-groups-repository";
import { FindGroupByIdUseCase } from "@/domain/stock/application/use-cases/find-group-by-id";
import { makeUser } from "test/factories/make-user";
import { makeGroup } from "test/factories/make-group";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { GroupNotFoundError } from "@/domain/stock/application/use-cases/errors/group-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindGroupUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let groupsRepository: InMemoryGroupsRepository;
  let findGroup: FindGroupByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    groupsRepository = new InMemoryGroupsRepository();
    findGroup = new FindGroupByIdUseCase(usersRepository, groupsRepository);
  });

  it("should be able to find a group", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const group = makeGroup({ companyId: user.companyId });
    await groupsRepository.create(group);

    const result = await findGroup.execute({
      authenticateId: user.id.toString(),
      groupId: group.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ group });
  });

  it("should return error if user does not exist", async () => {
    const result = await findGroup.execute({
      authenticateId: "non-existent",
      groupId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if group does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findGroup.execute({
      authenticateId: user.id.toString(),
      groupId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(GroupNotFoundError);
  });

  it("should return error if group does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherGroup = makeGroup();
    await groupsRepository.create(otherGroup);

    const result = await findGroup.execute({
      authenticateId: user.id.toString(),
      groupId: otherGroup.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
