import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { OnPasswordTokenCreated } from "./on-password-token-created";
import { makeUser } from "test/factories/make-user";
import { makePasswordToken } from "test/factories/make-password-token";
import { DomainEvents } from "@/core/events/domain-events";
import { describe, it, beforeEach, expect } from "vitest";
import { SendEmailUseCase } from "../use-cases/send-email";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryPasswordTokensRepository } from "test/repositories/in-memory-password-tokens-repository";

let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let sendEmail: SendEmailUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPasswordTokensRepository: InMemoryPasswordTokensRepository;

describe("On Password Token Created", () => {
  beforeEach(() => {
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryPasswordTokensRepository = new InMemoryPasswordTokensRepository();
    // Limpa os handlers de eventos anteriores
    DomainEvents.clearHandlers();
  });

  it("should send a password reset email when password token is created", async () => {
    // Registra o subscriber
    new OnPasswordTokenCreated(sendEmail, inMemoryUsersRepository);

    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const passwordToken = makePasswordToken({
      userId: user.id,
    });

    await inMemoryPasswordTokensRepository.create(passwordToken);

    // Dispara o evento
    DomainEvents.dispatchEventsForAggregate(passwordToken.id);

    // Verifica se o email foi enviado
    const sentEmail = fakeEmailSender.sentEmails[0];

    expect(sentEmail).toBeDefined();
    expect(sentEmail.to).toBe(user.email);
    expect(sentEmail.subject).toBe("Recuperação de Senha");
    expect(sentEmail.body).toContain(user.name);
    expect(sentEmail.body).toContain(passwordToken.token);
    expect(sentEmail.body).toContain(passwordToken.expiration.toLocaleString());
  });
});
