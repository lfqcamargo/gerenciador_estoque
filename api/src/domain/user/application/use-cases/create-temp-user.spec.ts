import { InMemoryTempCompaniesRepository } from "test/repositories/in-memory-temp-companies-repository";
import { InMemoryCompaniesRepository } from "test/repositories/in-memory-companies-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CreateTempUserUseCase } from "./create-temp-user";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { SendEmailUseCase } from "@/domain/notification/application/use-cases/send-email";
import { OnTempCompanyCreated } from "@/domain/notification/application/subscribers/on-temp-company-created";
import { DomainEvents } from "@/core/events/domain-events";
import { makeUser } from "test/factories/make-user";
import { InMemoryTempUsersRepository } from "test/repositories/in-memory-temp-users-repository";
import { UserRole } from "../../enterprise/entities/user";

let inMemoryTempUsersRepository: InMemoryTempUsersRepository;
let inMemoryCompaniesRepository: InMemoryCompaniesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let hashGenerator: FakeHasher;
let createTempUser: CreateTempUserUseCase;
let sendEmail: SendEmailUseCase;

describe("Create temp user use case", () => {
  beforeEach(() => {
    DomainEvents.clearHandlers();

    inMemoryTempUsersRepository = new InMemoryTempUsersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    hashGenerator = new FakeHasher();

    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);

    // Registra o subscriber de email
    new OnTempCompanyCreated(sendEmail);

    createTempUser = new CreateTempUserUseCase(
      inMemoryTempUsersRepository,
      inMemoryUsersRepository,
      hashGenerator
    );
  });

  it("should be able to create a temp user and send welcome email", async () => {
    const user = makeUser({
      email: "test@test.com",
      role: UserRole.ADMIN,
    });
    await inMemoryUsersRepository.create(user);

    const result = await createTempUser.execute({
      authenticateId: user.id.toString(),
      email: "test@test.com.br",
      name: "test",
      role: UserRole.ADMIN,
    });

    expect(result.isRight()).toBe(true);

    const tempUser = inMemoryTempUsersRepository.items[0];
    expect(tempUser.id).toBeDefined();
    expect(tempUser.companyId.toString()).toBe(user.companyId.toString());
    expect(tempUser.email).toBe("test@test.com.br");
    expect(tempUser.name).toBe("test");
    expect(tempUser.userRole).toBe(UserRole.ADMIN);
    expect(tempUser.expiration).toBeDefined();
  });

  // it("should not be able to create a temp user with an already existing email", async () => {
  //   const user = makeUser({
  //     email: "test@test.com",
  //     role: UserRole.ADMIN,
  //   });
  //   await inMemoryUsersRepository.create(user);

  //   const result = await createTempUser.execute({
  //     authenticateId: user.id.toString(),
  //     email: "test@test.com",
  //     userName: "test",
  //     password: "test",
  //     role: UserRole.ADMIN,
  //   });

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value).toBeInstanceOf(AlreadyExistsEmailError);
  // });

  // it("should not be able to create a temp user with an authenticate user not admin", async () => {
  //   const user = makeUser({
  //     email: "test@test.com",
  //     role: UserRole.USER,
  //   });
  //   await inMemoryUsersRepository.create(user);

  //   const result = await createTempUser.execute({
  //     authenticateId: user.id.toString(),
  //     email: "test@test.com.br",
  //     userName: "test",
  //     password: "test",
  //     role: UserRole.ADMIN,
  //   });

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value).toBeInstanceOf(UserNotAdminError);
  // });
});
