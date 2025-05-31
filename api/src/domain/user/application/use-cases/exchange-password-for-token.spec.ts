import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryEmailsRepository } from "test/repositories/in-memory-emails-repository";
import { FakeEmailSender } from "test/services/fake-email-sender";
import { SendEmailUseCase } from "@/domain/notification/application/use-cases/send-email";
import { DomainEvents } from "@/core/events/domain-events";
import { makeUser } from "test/factories/make-user";
import { ExchangePasswordForTokenUseCase } from "./exchange-password-for-token";
import { InMemoryPasswordTokensRepository } from "test/repositories/in-memory-password-tokens-repository";
import { makePasswordToken } from "test/factories/make-password-token";
import { OnChangePassword } from "@/domain/notification/application/subscribers/on-change-password";
import { TokenExpiratedError } from "./errors/token-expirated-error";
import { ResourceTokenNotFoundError } from "./errors/resource-token-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryEmailsRepository: InMemoryEmailsRepository;
let inMemoryPasswordTokensRepository: InMemoryPasswordTokensRepository;
let fakeEmailSender: FakeEmailSender;
let hashGenerator: FakeHasher;
let hashComparer: FakeHasher;
let sendEmail: SendEmailUseCase;
let exchangePasswordForToken: ExchangePasswordForTokenUseCase;

describe("Exchange password for token use case", () => {
  beforeEach(() => {
    // Limpa os handlers de eventos anteriores
    DomainEvents.clearHandlers();

    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryEmailsRepository = new InMemoryEmailsRepository();
    inMemoryPasswordTokensRepository = new InMemoryPasswordTokensRepository();
    fakeEmailSender = new FakeEmailSender();
    hashGenerator = new FakeHasher();
    hashComparer = new FakeHasher();

    sendEmail = new SendEmailUseCase(inMemoryEmailsRepository, fakeEmailSender);

    new OnChangePassword(sendEmail);

    exchangePasswordForToken = new ExchangePasswordForTokenUseCase(
      inMemoryUsersRepository,
      inMemoryPasswordTokensRepository,
      hashComparer,
      hashGenerator
    );
  });

  it("should be able to exchange password for token", async () => {
    const user = makeUser({ email: "test@test.com" });
    await inMemoryUsersRepository.create(user);

    const passwordToken = makePasswordToken({
      user: user,
      token: "token-test",
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    await inMemoryPasswordTokensRepository.create(passwordToken);

    const result = await exchangePasswordForToken.execute({
      token: passwordToken.token,
      password: "test",
    });

    expect(result.isRight()).toBe(true);

    const updatedPasswordToken = inMemoryPasswordTokensRepository.items[0];

    expect(updatedPasswordToken.id).toBeDefined();
    expect(updatedPasswordToken.token).toBe("token-test");
    expect(updatedPasswordToken.expiration).toBeDefined();
    expect(updatedPasswordToken.user.id).toBe(user.id);

    const sentEmail = fakeEmailSender.sentEmails[0];

    expect(sentEmail).toBeDefined();
    expect(sentEmail.to).toBe("test@test.com");
    expect(sentEmail.subject).toBe("Senha alterada com sucesso");
  });

  it("should not be able to exchange password for token with an expired token", async () => {
    const user = makeUser({ email: "test@test.com" });
    await inMemoryUsersRepository.create(user);

    const passwordToken = makePasswordToken({
      user: user,
      token: "token-test",
      expiration: new Date(Date.now() - 1000 * 60 * 60 * 24),
    });

    await inMemoryPasswordTokensRepository.create(passwordToken);

    const result = await exchangePasswordForToken.execute({
      token: passwordToken.token,
      password: "test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(TokenExpiratedError);
  });

  it("should not be able to exchange password for token with an invalid token", async () => {
    const result = await exchangePasswordForToken.execute({
      token: "invalid-token",
      password: "test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceTokenNotFoundError);
  });
});
