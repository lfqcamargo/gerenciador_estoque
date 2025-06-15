import { describe, it, beforeEach, expect } from "vitest";
import { CreateGroupUseCase } from "./create-group";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryGroupsRepository } from "test/repositories/in-memory-groups-repository";
import { makeUser } from "test/factories/make-user";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { AlreadyExistsGroupError } from "./errors/already-exists-group-error";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeGroup } from "test/factories/make-group";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGroupsRepository: InMemoryGroupsRepository;
let createGroupUseCase: CreateGroupUseCase;

describe("Create group use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGroupsRepository = new InMemoryGroupsRepository();

    createGroupUseCase = new CreateGroupUseCase(
      inMemoryUsersRepository,
      inMemoryGroupsRepository
    );
  });

  it("should be able to create a group", async () => {
    const adminUser = makeUser({ role: UserRole.ADMIN });
    await inMemoryUsersRepository.create(adminUser);

    const result = await createGroupUseCase.execute({
      authenticateId: adminUser.id.toString(),
      name: "Finance",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    const group = inMemoryGroupsRepository.items[0];

    expect(group).toBeDefined();
    expect(group.name).toBe("Finance");
    expect(group.active).toBe(true);
    expect(group.companyId.toString()).toBe(adminUser.companyId.toString());
  });

  it("should not create group if user is not found", async () => {
    const result = await createGroupUseCase.execute({
      authenticateId: "non-existent-id",
      name: "RH",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not create group if user is not admin", async () => {
    const employee = makeUser({ role: UserRole.EMPLOYEE });
    await inMemoryUsersRepository.create(employee);

    const result = await createGroupUseCase.execute({
      authenticateId: employee.id.toString(),
      name: "RH",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should not create group if name already exists in the company", async () => {
    const admin = makeUser({ role: UserRole.ADMIN });
    await inMemoryUsersRepository.create(admin);

    const group = makeGroup({ companyId: admin.companyId, name: "Finance" });
    await inMemoryGroupsRepository.create(group);

    const result = await createGroupUseCase.execute({
      authenticateId: admin.id.toString(),
      name: "Finance",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsGroupError);
  });
});
