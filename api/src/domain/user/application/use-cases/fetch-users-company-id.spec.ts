import { describe, it, expect, beforeEach } from "vitest";
import { FetchUsersCompanyIdUseCase } from "./fetch-users-company-id";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { CompanyNotFoundError } from "./errors/company-not-found-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotBelongToCompanyError } from "./errors/user-not-belong-to-company-error";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let sut: FetchUsersCompanyIdUseCase;

describe("FetchUsersUseCase", () => {
  beforeEach(() => {
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );
    sut = new FetchUsersCompanyIdUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository
    );
  });

  it("should return all users for a valid company and authenticated user", async () => {
    const company = makeCompany();
    const user = makeUser({ companyId: company.id });
    const otherUser = makeUser({ companyId: company.id });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(otherUser);

    const otherCompany = makeCompany();
    const otherUserCompany = makeUser({
      companyId: otherCompany.id,
    });
    await inMemoryCompaniesRepository.create(otherCompany);
    await inMemoryUsersRepository.create(otherUserCompany);

    const result = await sut.execute({
      companyId: company.id.toString(),
      authenticatedUserId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2);
    }
  });

  it("should return CompanyNotFoundError if company does not exist", async () => {
    const company = makeCompany();
    const anotherCompany = makeCompany();
    await inMemoryCompaniesRepository.create(company);
    await inMemoryCompaniesRepository.create(anotherCompany);

    const user = makeUser({ companyId: company.id });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: "non-existent-company",
      authenticatedUserId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it("should return UserNotFoundError if user does not exist", async () => {
    const company = makeCompany();
    const user = makeUser({ companyId: company.id });
    await inMemoryCompaniesRepository.create(company);

    const result = await sut.execute({
      companyId: company.id.toString(),
      authenticatedUserId: "non-existent-user",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return UserNotBelongToCompanyError if user does not belong to the company", async () => {
    const company = makeCompany();
    const anotherCompany = makeCompany();
    const user = makeUser({ companyId: anotherCompany.id });

    await inMemoryCompaniesRepository.create(company);
    await inMemoryCompaniesRepository.create(anotherCompany);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: company.id.toString(),
      authenticatedUserId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });
});
