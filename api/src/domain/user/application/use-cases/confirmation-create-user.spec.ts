import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { makeTempCompany } from "test/factories/make-temp-company";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";
import { ConfirmationCreateUserUseCase } from "./confirmation-create-user";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryTempUsersRepository } from "test/repositories/in-memory-temp-users-repository";
import { makeTempUser } from "test/factories/make-temp-user";
import { UserRole } from "../../enterprise/entities/user";
import { DomainEvents } from "@/core/events/domain-events";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryTempUsersRepository: InMemoryTempUsersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryHashGenerator: FakeHasher;
let sut: ConfirmationCreateUserUseCase;

describe("Confirmation create user use case", () => {
  beforeEach(() => {
    inMemoryTempUsersRepository = new InMemoryTempUsersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryHashGenerator = new FakeHasher();

    sut = new ConfirmationCreateUserUseCase(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository,
      inMemoryHashGenerator
    );
  });

  it("should be able to confirm create user", async () => {
    const userTemp = makeTempUser({
      companyId: new UniqueEntityID("12345678901234"),
      name: "Test User",
      email: "test@test.com",
      userRole: UserRole.ADMIN,
    });

    await inMemoryTempUsersRepository.create(userTemp);

    const result = await sut.execute({
      token: userTemp.token,
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].email).toEqual(userTemp.email);
    expect(inMemoryUsersRepository.items[0].name).toEqual(userTemp.name);
    expect(inMemoryUsersRepository.items[0].role).toEqual(userTemp.userRole);
    expect(inMemoryUsersRepository.items[0].companyId).toEqual(
      userTemp.companyId
    );
  });

  it("should not be able to confirm create user with invalid token", async () => {
    const result = await sut.execute({
      token: "invalid-token",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceTokenNotFoundError);
  });

  it("should not be able to confirm create user with expired token", async () => {
    const userTemp = makeTempUser({
      companyId: new UniqueEntityID("12345678901234"),
      name: "Test User",
      email: "test@test.com",
      expiration: new Date(Date.now() - 1000),
    });

    await inMemoryTempUsersRepository.create(userTemp);

    const result = await sut.execute({
      token: userTemp.token,
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceTokenNotFoundError);
  });
});
