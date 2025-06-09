import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateTempCompanyUseCase } from "./create-temp-company";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { SendEmailUseCase } from "@/domain/notification/application/use-cases/send-email";
import { OnTempCompanyCreated } from "@/domain/notification/application/subscribers/on-temp-company-created";
import { DomainEvents } from "@/core/events/domain-events";
import { AlreadyExistsCnpjError } from "./errors/already-exists-cnpj-error";
import { AlreadyExistsEmailError } from "./errors/already-exists-email-error";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
let inMemoryTempCompaniesRepository: InMemoryTempCompaniesRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let hashGenerator: FakeHasher;
let createTempCompany: CreateTempCompanyUseCase;
let sendEmail: SendEmailUseCase;

describe("Create temp user use case", () => {
  beforeEach(() => {
    DomainEvents.clearHandlers();

    inMemoryTempCompaniesRepository = new InMemoryTempCompaniesRepository();
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryTempCompaniesRepository,
      inMemoryUsersRepository
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    hashGenerator = new FakeHasher();

    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);

    new OnTempCompanyCreated(sendEmail);

    createTempCompany = new CreateTempCompanyUseCase(
      inMemoryTempCompaniesRepository,
      inMemoryCompaniesRepository,
      inMemoryUsersRepository,
      hashGenerator
    );
  });

  it("should be able to create a temp user and send welcome email", async () => {
    const result = await createTempCompany.execute({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "test",
      password: "test",
    });

    expect(result.isRight()).toBe(true);

    const tempUser = inMemoryTempCompaniesRepository.items[0];
    expect(tempUser.id).toBeDefined();
    expect(tempUser.cnpj).toBe("12345678901234");
    expect(tempUser.companyName).toBe("Test Company");
    expect(tempUser.email).toBe("test@test.com");
    expect(tempUser.userName).toBe("test");
    expect(tempUser.password).toBe("test-hashed");
    expect(tempUser.expiration).toBeDefined();
  });

  it("should not be able to create a temp user with an already existing cnpj", async () => {
    const user = makeUser({
      email: "test@test.com",
    });
    const company = makeCompany(
      {
        cnpj: "12345678901234",
        users: [user],
      },
      new UniqueEntityID(user.companyId)
    );
    await inMemoryCompaniesRepository.create(company);

    const result = await createTempCompany.execute({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "test",
      password: "test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsCnpjError);
  });

  it("should not be able to create a temp user with an already existing email", async () => {
    await inMemoryUsersRepository.create(makeUser({ email: "test@test.com" }));

    const result = await createTempCompany.execute({
      cnpj: "12345678901235",
      companyName: "Test Company",
      email: "test@test.com",
      userName: "test",
      password: "test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsEmailError);
  });
});
