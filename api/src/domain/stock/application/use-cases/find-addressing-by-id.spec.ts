import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryAddressingsRepository } from "test/repositories/in-memory-addressings-repository";
import { FindAddressingByIdUseCase } from "@/domain/stock/application/use-cases/find-addressing-by-id";
import { makeUser } from "test/factories/make-user";
import { makeAddressing } from "test/factories/make-addressing";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { AddressingNotFoundError } from "@/domain/stock/application/use-cases/errors/addressing-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindAddressingUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let addressingsRepository: InMemoryAddressingsRepository;
  let findAddressing: FindAddressingByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    addressingsRepository = new InMemoryAddressingsRepository();
    findAddressing = new FindAddressingByIdUseCase(
      usersRepository,
      addressingsRepository
    );
  });

  it("should be able to find a addressing", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const addressing = makeAddressing({ companyId: user.companyId });
    await addressingsRepository.create(addressing);

    const result = await findAddressing.execute({
      authenticateId: user.id.toString(),
      addressingId: addressing.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ addressing });
  });

  it("should return error if user does not exist", async () => {
    const result = await findAddressing.execute({
      authenticateId: "non-existent",
      addressingId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if addressing does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findAddressing.execute({
      authenticateId: user.id.toString(),
      addressingId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AddressingNotFoundError);
  });

  it("should return error if addressing does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherAddressing = makeAddressing();
    await addressingsRepository.create(otherAddressing);

    const result = await findAddressing.execute({
      authenticateId: user.id.toString(),
      addressingId: otherAddressing.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
