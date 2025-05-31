import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryPasswordTokensRepository } from "test/repositories/in-memory-password-tokens-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { GenerateNewPasswordTokenUseCase } from "./generate-new-password-token";
import { UserNotFoundError } from "./errors/user-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPasswordTokensRepository: InMemoryPasswordTokensRepository;
let fakeHasher: FakeHasher;
let sut: GenerateNewPasswordTokenUseCase;

describe("Generate new password token", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryPasswordTokensRepository = new InMemoryPasswordTokensRepository();
    fakeHasher = new FakeHasher();

    sut = new GenerateNewPasswordTokenUseCase(
      inMemoryUsersRepository,
      inMemoryPasswordTokensRepository,
      fakeHasher
    );
  });

  it("should generate a new password token", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      email: user.email,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.token).toBeTruthy();
      expect(result.value.expiration).toBeInstanceOf(Date);
      expect(inMemoryPasswordTokensRepository.items).toHaveLength(1);
    }
  });

  it("should not generate a token for non-existing user", async () => {
    const result = await sut.execute({
      email: "non-existing@example.com",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should delete previous tokens when generating a new one", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    await sut.execute({
      email: user.email,
    });

    const result = await sut.execute({
      email: user.email,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPasswordTokensRepository.items).toHaveLength(1);
  });
});
