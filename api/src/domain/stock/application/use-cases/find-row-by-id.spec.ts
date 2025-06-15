import { describe, it, beforeEach, expect } from "vitest";

import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryRowsRepository } from "test/repositories/in-memory-rows-repository";
import { FindRowByIdUseCase } from "@/domain/stock/application/use-cases/find-row-by-id";
import { makeUser } from "test/factories/make-user";
import { makeRow } from "test/factories/make-row";
import { UserNotFoundError } from "@/domain/user/application/use-cases/errors/user-not-found-error";
import { RowNotFoundError } from "@/domain/stock/application/use-cases/errors/row-not-found-error";
import { UserNotBelongToCompanyError } from "@/domain/user/application/use-cases/errors/user-not-belong-to-company-error";

describe("FindRowUseCase", () => {
  let usersRepository: InMemoryUsersRepository;
  let rowsRepository: InMemoryRowsRepository;
  let findRow: FindRowByIdUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    rowsRepository = new InMemoryRowsRepository();
    findRow = new FindRowByIdUseCase(usersRepository, rowsRepository);
  });

  it("should be able to find a row", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const row = makeRow({ companyId: user.companyId });
    await rowsRepository.create(row);

    const result = await findRow.execute({
      authenticateId: user.id.toString(),
      rowId: row.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ row });
  });

  it("should return error if user does not exist", async () => {
    const result = await findRow.execute({
      authenticateId: "non-existent",
      rowId: "any",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if row does not exist", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const result = await findRow.execute({
      authenticateId: user.id.toString(),
      rowId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RowNotFoundError);
  });

  it("should return error if row does not belong to user company", async () => {
    const user = makeUser();
    await usersRepository.create(user);

    const otherRow = makeRow();
    await rowsRepository.create(otherRow);

    const result = await findRow.execute({
      authenticateId: user.id.toString(),
      rowId: otherRow.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
