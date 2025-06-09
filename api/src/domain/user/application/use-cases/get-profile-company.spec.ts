import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { GetProfileCompanyUseCase } from "./get-profile-company";
import { makeUser } from "test/factories/make-user";
import { makeCompany } from "test/factories/make-company";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { CompanyNotFoundError } from "./errors/company-not-found-error";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let sut: GetProfileCompanyUseCase;

describe("Get profile company", () => {
  beforeEach(() => {
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );
    sut = new GetProfileCompanyUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository
    );
  });

  it("should return the company profile when user is authenticated and belongs to the company", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user = makeUser({ companyId: company.id.toString() });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: company.id.toString(),
      userAuthenticateId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.company.id).toEqual(company.id);
    }
  });

  it("should return UserNotFoundError if the user does not exist", async () => {
    const result = await sut.execute({
      companyId: "company-id",
      userAuthenticateId: "non-existent-user-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return CompanyNotFoundError if the company does not exist", async () => {
    const user = makeUser({ companyId: "company-id" });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: "non-existent-company-id",
      userAuthenticateId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it("should return CompanyNotFoundError if user does not belong to the company", async () => {
    const company = makeCompany();
    const anotherCompany = makeCompany();
    await inMemoryCompaniesRepository.create(company);
    await inMemoryCompaniesRepository.create(anotherCompany);

    const user = makeUser({ companyId: company.id.toString() });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: anotherCompany.id.toString(),
      userAuthenticateId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });
});
