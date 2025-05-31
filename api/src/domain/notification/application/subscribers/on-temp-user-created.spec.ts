import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { SendEmailUseCase } from "../use-cases/send-email";
import { OnTempUserCreated } from "./on-temp-user-created";
import { TempUser } from "@/domain/user/enterprise/entities/temp_user";
import { DomainEvents } from "@/core/events/domain-events";
import { describe, it, beforeEach, expect } from "vitest";

let inMemoryEmailsRepository: InMemoryEmailsRepository;
let fakeEmailSender: FakeEmailSender;
let sendEmail: SendEmailUseCase;

describe("On Temp User Created", () => {
  beforeEach(() => {
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    fakeEmailSender = new FakeEmailSender();
    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);

    // Limpa os handlers de eventos anteriores
    DomainEvents.clearHandlers();
  });

  it("should send a welcome email when temp user is created", async () => {
    // Registra o subscriber
    new OnTempUserCreated(sendEmail);

    // Cria um usuário temporário
    const tempUser = TempUser.create({
      cnpj: "12345678901234",
      companyName: "Test Company",
      email: "test@example.com",
      userName: "John Doe",
      password: "123456",
      token: "test-token",
      expiration: new Date(),
    });

    // Dispara os eventos do usuário
    DomainEvents.dispatchEventsForAggregate(tempUser.id);

    // Verifica se o email foi enviado
    const sentEmail = fakeEmailSender.sentEmails[0];

    expect(sentEmail).toBeDefined();
    expect(sentEmail.to).toBe("test@example.com");
    expect(sentEmail.subject).toBe(
      "Bem-vindo ao Sistema de Controle de Vendas"
    );
    expect(sentEmail.body).toContain("John Doe");
    expect(sentEmail.body).toContain("test-token");
  });
});
