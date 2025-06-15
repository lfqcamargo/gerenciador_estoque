import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryMaterialsRepository } from "test/repositories/in-memory-materials-repository";
import { FindMaterialByIdUseCase } from "@/domain/stock/application/use-cases/find-material-by-id";
import { makeUser } from "test/factories/make-user";
import { makeMaterial } from "test/factories/make-material";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { MaterialNotFoundError } from "@/domain/stock/application/use-cases/errors/material-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindMaterialUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let materialsRepository: InMemoryMaterialsRepository;
  let findMaterial: FindMaterialByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    materialsRepository = new InMemoryMaterialsRepository();
    findMaterial = new FindMaterialByIdUseCase(
      usersRepository,
      materialsRepository
    );
  });

  it("should be able to find a material", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const material = makeMaterial({ companyId: user.companyId });
    await materialsRepository.create(material);

    const result = await findMaterial.execute({
      authenticateId: user.id.toString(),
      materialId: material.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ material });
  });

  it("should return error if user does not exist", async () => {
    const result = await findMaterial.execute({
      authenticateId: "non-existent",
      materialId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if material does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findMaterial.execute({
      authenticateId: user.id.toString(),
      materialId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(MaterialNotFoundError);
  });

  it("should return error if material does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherMaterial = makeMaterial();
    await materialsRepository.create(otherMaterial);

    const result = await findMaterial.execute({
      authenticateId: user.id.toString(),
      materialId: otherMaterial.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
