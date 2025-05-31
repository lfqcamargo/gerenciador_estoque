import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { makeUser } from "test/factories/make-user";
import { DomainEvents } from "@/core/events/domain-events";
import { describe, it, beforeEach, expect } from "vitest";
import { SendEmailUseCase } from "../use-cases/send-email";
import { OnChangePassword } from "./on-change-password";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let sendEmail: SendEmailUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("On Change Password", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);

    // Limpa os handlers de eventos anteriores
    DomainEvents.clearHandlers();
  });

  it("should send a password change email when password is changed", async () => {
    // Registra o subscriber
    new OnChangePassword(sendEmail);

    const user = makeUser();

    user.password = "new-password";
    // Dispara o evento
    DomainEvents.dispatchEventsForAggregate(user.id);

    // Verifica se o email foi enviado
    const sentEmail = fakeEmailSender.sentEmails[0];

    expect(sentEmail).toBeDefined();
    expect(sentEmail.to).toBe(user.email);
    expect(sentEmail.subject).toBe("Senha alterada com sucesso");
    expect(sentEmail.body).toContain(user.name);
  });
});
