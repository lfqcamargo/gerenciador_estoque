import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { makeUser } from "test/factories/make-user";
import { makeCompany } from "test/factories/make-company";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { CompanyNotFoundError } from "./errors/company-not-found-error";
import { InMemoryTempUsersRepository } from "test/repositories/in-memory-temp-users-repository";
import { EditCompanyUseCase } from "./edit-company";
import { UserRole } from "../../enterprise/entities/user";
import { UserNotAdminError } from "./errors/user-not-admin-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryTempUsersRepository: InMemoryTempUsersRepository;
let sut: EditCompanyUseCase;

describe("Edit company", () => {
  beforeEach(() => {
    inMemoryTempUsersRepository = new InMemoryTempUsersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository
    );
    sut = new EditCompanyUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to edit the company", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user = makeUser({ companyId: company.id.toString() });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: company.id.toString(),
      authenticateUserId: user.id.toString(),
      name: "New name",
      lealName: "New leal name",
      photo: "New photo",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.company.id).toEqual(company.id);
    }
  });

  it("should not be able to edit the company if the user does not exist", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const result = await sut.execute({
      companyId: company.id.toString(),
      authenticateUserId: "non-existent-user-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to edit the company if the company does not exist", async () => {
    const user = makeUser({ companyId: "company-id" });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: "non-existent-company-id",
      authenticateUserId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it("should not be able to edit the company if user does not belong to the company", async () => {
    const company = makeCompany();
    const anotherCompany = makeCompany();
    await inMemoryCompaniesRepository.create(company);
    await inMemoryCompaniesRepository.create(anotherCompany);

    const user = makeUser({ companyId: company.id.toString() });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: anotherCompany.id.toString(),
      authenticateUserId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CompanyNotFoundError);
  });

  it("should not be able to edit the company if user is not admin", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user = makeUser({
      companyId: company.id.toString(),
      role: UserRole.USER,
    });
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      companyId: company.id.toString(),
      authenticateUserId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });
});
