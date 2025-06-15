import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryPositionsRepository } from "test/repositories/in-memory-positions-repository";
import { FindPositionByIdUseCase } from "@/domain/stock/application/use-cases/find-position-by-id";
import { makeUser } from "test/factories/make-user";
import { makePosition } from "test/factories/make-position";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { PositionNotFoundError } from "@/domain/stock/application/use-cases/errors/position-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindPositionUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let positionsRepository: InMemoryPositionsRepository;
  let findPosition: FindPositionByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    positionsRepository = new InMemoryPositionsRepository();
    findPosition = new FindPositionByIdUseCase(
      usersRepository,
      positionsRepository
    );
  });

  it("should be able to find a position", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const position = makePosition({ companyId: user.companyId });
    await positionsRepository.create(position);

    const result = await findPosition.execute({
      authenticateId: user.id.toString(),
      positionId: position.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ position });
  });

  it("should return error if user does not exist", async () => {
    const result = await findPosition.execute({
      authenticateId: "non-existent",
      positionId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if position does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findPosition.execute({
      authenticateId: user.id.toString(),
      positionId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PositionNotFoundError);
  });

  it("should return error if position does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherPosition = makePosition();
    await positionsRepository.create(otherPosition);

    const result = await findPosition.execute({
      authenticateId: user.id.toString(),
      positionId: otherPosition.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
