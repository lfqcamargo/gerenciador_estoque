import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryTempUsersRepository } from "test/repositories/in-memory-temp-users-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ConfirmationCreateCompanyUseCase } from "./confirmation-create-company";
import { makeTempUser } from "test/factories/make-temp-user";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";

let inMemoryTempUsersRepository: InMemoryTempUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ConfirmationCreateCompanyUseCase;

describe("Confirmation create company use case", () => {
  beforeEach(() => {
    inMemoryTempUsersRepository = new InMemoryTempUsersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository
    );

    sut = new ConfirmationCreateCompanyUseCase(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository,
      inMemoryCompaniesRepository
    );
  });

  it("should be able to confirm create company", async () => {
    const userTemp = makeTempUser({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "Test User",
      password: "123456",
    });

    await inMemoryTempUsersRepository.create(userTemp);

    const result = await sut.execute({ token: userTemp.token });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCompaniesRepository.items[0].cnpj).toEqual(userTemp.cnpj);
    expect(inMemoryCompaniesRepository.items[0].name).toEqual(
      userTemp.companyName
    );

    expect(inMemoryUsersRepository.items[0].email).toEqual(userTemp.email);
    expect(inMemoryUsersRepository.items[0].name).toEqual(userTemp.userName);
    expect(inMemoryUsersRepository.items[0].password).toEqual(
      userTemp.password
    );
    expect(inMemoryUsersRepository.items[0].role).toEqual("ADMIN");
    expect(inMemoryUsersRepository.items[0].companyId).toEqual(
      inMemoryCompaniesRepository.items[0].id.toString()
    );

    expect(inMemoryTempUsersRepository.items).toHaveLength(0);
  });

  it("should not be able to confirm create company with invalid token", async () => {
    const result = await sut.execute({ token: "invalid-token" });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceTokenNotFoundError);
  });

  it("should not be able to confirm create company with expired token", async () => {
    const userTemp = makeTempUser({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "Test User",
      password: "123456",
      expiration: new Date(Date.now() - 1000),
    });

    await inMemoryTempUsersRepository.create(userTemp);

    const result = await sut.execute({ token: userTemp.token });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceTokenNotFoundError);
  });
});
