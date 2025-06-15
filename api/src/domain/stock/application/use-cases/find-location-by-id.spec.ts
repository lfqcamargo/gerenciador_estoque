import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryLocationsRepository } from "test/repositories/in-memory-locations-repository";
import { FindLocationByIdUseCase } from "@/domain/stock/application/use-cases/find-location-by-id";
import { makeUser } from "test/factories/make-user";
import { makeLocation } from "test/factories/make-location";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { LocationNotFoundError } from "@/domain/stock/application/use-cases/errors/location-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindLocationUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let locationsRepository: InMemoryLocationsRepository;
  let findLocation: FindLocationByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    locationsRepository = new InMemoryLocationsRepository();
    findLocation = new FindLocationByIdUseCase(
      usersRepository,
      locationsRepository
    );
  });

  it("should be able to find a location", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const location = makeLocation({ companyId: user.companyId });
    await locationsRepository.create(location);

    const result = await findLocation.execute({
      authenticateId: user.id.toString(),
      locationId: location.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ location });
  });

  it("should return error if user does not exist", async () => {
    const result = await findLocation.execute({
      authenticateId: "non-existent",
      locationId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if location does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findLocation.execute({
      authenticateId: user.id.toString(),
      locationId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(LocationNotFoundError);
  });

  it("should return error if location does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherLocation = makeLocation();
    await locationsRepository.create(otherLocation);

    const result = await findLocation.execute({
      authenticateId: user.id.toString(),
      locationId: otherLocation.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
