import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { SendEmailUseCase } from "../use-cases/send-email";
import { OnTempUserCreated } from "./on-temp-user-created";
import { TempUser } from "@/domain/user/enterprise/entities/temp-user";
import { DomainEvents } from "@/core/events/domain-events";
import { describe, it, beforeEach, expect } from "vitest";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let sendEmail: SendEmailUseCase;

describe("On Temp User Created", () => {
  beforeEach(() => {
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);

    DomainEvents.clearHandlers();
  });

  it("should send a welcome email when temp user is created", async () => {
    new OnTempUserCreated(sendEmail);

    const tempUser = TempUser.create({
      companyId: new UniqueEntityID("12345678901234"),
      email: "test@example.com",
      name: "John Doe",
      userRole: UserRole.ADMIN,
      token: "test-token",
      expiration: new Date(),
    });

    DomainEvents.dispatchEventsForAggregate(tempUser.id);

    const sentEmail = fakeEmailSender.sentEmails[0];

    expect(sentEmail).toBeDefined();
    expect(sentEmail.to).toBe("test@example.com");
    expect(sentEmail.body).toContain("John Doe");
    expect(sentEmail.body).toContain("test-token");
  });
});
