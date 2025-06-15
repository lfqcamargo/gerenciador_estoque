import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemorySubsLocationRepository } from "test/repositories/in-memory-subs-location-repository";
import { FindSubLocationByIdUseCase } from "@/domain/stock/application/use-cases/find-sub-location-by-id";
import { makeUser } from "test/factories/make-user";
import { makeSubLocation } from "test/factories/make-sub-location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { SubLocationNotFoundError } from "@/domain/stock/application/use-cases/errors/sub-location-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindSubLocationUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let subslocationRepository: InMemorySubsLocationRepository;
  let findSubLocation: FindSubLocationByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    subslocationRepository = new InMemorySubsLocationRepository();
    findSubLocation = new FindSubLocationByIdUseCase(
      usersRepository,
      subslocationRepository
    );
  });

  it("should be able to find a sublocation", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const sublocation = makeSubLocation({ companyId: user.companyId });
    await subslocationRepository.create(sublocation);

    const result = await findSubLocation.execute({
      authenticateId: user.id.toString(),
      sublocationId: sublocation.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ sublocation });
  });

  it("should return error if user does not exist", async () => {
    const result = await findSubLocation.execute({
      authenticateId: "non-existent",
      sublocationId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if sublocation does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findSubLocation.execute({
      authenticateId: user.id.toString(),
      sublocationId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SubLocationNotFoundError);
  });

  it("should return error if sublocation does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherSubLocation = makeSubLocation();
    await subslocationRepository.create(otherSubLocation);

    const result = await findSubLocation.execute({
      authenticateId: user.id.toString(),
      sublocationId: otherSubLocation.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
