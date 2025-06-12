import { describe, it, expect, beforeEach } from "vitest";
import { DeleteUserUseCase } from "./delete-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { UserRole } from "../../enterprise/entities/user";
import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { makeCompany } from "test/factories/make-company";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { UserNotAdminError } from "./errors/user-not-admin-error";
import { UserNotBelongToCompanyError } from "./errors/user-not-belong-to-company-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let sut: DeleteUserUseCase;

describe("Delete User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );
    sut = new DeleteUserUseCase(inMemoryUsersRepository);
  });

  it("should allow a user to delete", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user = makeUser({
      companyId: company.id.toString(),
      role: UserRole.ADMIN,
    });

    const user2 = makeUser({
      companyId: company.id.toString(),
      role: UserRole.ADMIN,
    });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(user2);

    const result = await sut.execute({
      userId: user.id.toString(),
      authenticatedUserId: user2.id.toString(),
    });

    expect(result.isRight()).toBe(true);
  });

  it("should not allow a user to delete another user", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user1 = makeUser({
      companyId: company.id.toString(),
      role: UserRole.EMPLOYEE,
    });
    const user2 = makeUser({ role: UserRole.EMPLOYEE });

    await inMemoryUsersRepository.create(user1);
    await inMemoryUsersRepository.create(user2);

    const result = await sut.execute({
      userId: user2.id.toString(),
      authenticatedUserId: user1.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should not allow admin to delete user from a different company", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user1 = makeUser({
      companyId: company.id.toString(),
      role: UserRole.ADMIN,
    });
    const user2 = makeUser({ role: UserRole.EMPLOYEE });

    await inMemoryUsersRepository.create(user1);
    await inMemoryUsersRepository.create(user2);

    const result = await sut.execute({
      userId: user2.id.toString(),
      authenticatedUserId: user1.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotBelongToCompanyError);
  });

  it("should return error if target user does not exist", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user1 = makeUser({
      companyId: company.id.toString(),
      role: UserRole.ADMIN,
    });

    const result = await sut.execute({
      userId: "non-existent-user",
      authenticatedUserId: user1.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if authenticated user does not exist", async () => {
    const company = makeCompany();
    await inMemoryCompaniesRepository.create(company);

    const user1 = makeUser({
      companyId: company.id.toString(),
      role: UserRole.ADMIN,
    });

    const result = await sut.execute({
      userId: user1.id.toString(),
      authenticatedUserId: "non-existent-user",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
