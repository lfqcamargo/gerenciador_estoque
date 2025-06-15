import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryGroupsRepository } from "test/repositories/in-memory-groups-repository";
import { InMemoryMaterialsRepository } from "test/repositories/in-memory-materials-repository";

import { CreateMaterialUseCase } from "./create-material";
import { makeUser } from "test/factories/make-user";
import { makeGroup } from "test/factories/make-group";
import { makeMaterial } from "test/factories/make-material";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { UserNotAdminError } from "@/domain/user/application/use-cases/errors/user-not-admin-error";
import { AlreadyExistsMaterialError } from "./errors/already-exists-material-error";
import { GroupNotFoundError } from "./errors/group-not-found-error";

let usersRepository: InMemoryUsersRepository;
let groupsRepository: InMemoryGroupsRepository;
let materialsRepository: InMemoryMaterialsRepository;
let createMaterial: CreateMaterialUseCase;

describe("Create Material Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    groupsRepository = new InMemoryGroupsRepository();
    materialsRepository = new InMemoryMaterialsRepository();

    createMaterial = new CreateMaterialUseCase(
      usersRepository,
      groupsRepository,
      materialsRepository
    );
  });

  it("should create a material when user is admin and group exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const group = makeGroup({ companyId: user.companyId });
    await groupsRepository.create(group);

    const result = await createMaterial.execute({
      authenticateId: user.id.toString(),
      groupId: group.id.toString(),
      name: "Steel Bar",
      active: true,
    });

    expect(result.isRight()).toBe(true);
    expect(materialsRepository.items).toHaveLength(1);
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const result = await createMaterial.execute({
      authenticateId: "non-existent-id",
      groupId: "any-group-id",
      name: "Material X",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotAdminError if user is not admin", async () => {
    const user = makeUser({ role: UserRole.EMPLOYEE });
    await usersRepository.create(user);

    const result = await createMaterial.execute({
      authenticateId: user.id.toString(),
      groupId: "any-group-id",
      name: "Material Y",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return GroupNotFoundError if group does not exist", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const result = await createMaterial.execute({
      authenticateId: user.id.toString(),
      groupId: "non-existent-group-id",
      name: "Material Z",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(GroupNotFoundError);
  });

  it("should return AlreadyExistsMaterialError if material with same name exists", async () => {
    const user = makeUser({ role: UserRole.ADMIN });
    await usersRepository.create(user);

    const group = makeGroup({ companyId: user.companyId });
    await groupsRepository.create(group);

    const material = makeMaterial({
      companyId: user.companyId,
      name: "Duplicated Material",
    });

    await materialsRepository.create(material);

    const result = await createMaterial.execute({
      authenticateId: user.id.toString(),
      groupId: group.id.toString(),
      name: "Duplicated Material",
      active: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsMaterialError);
  });
});
