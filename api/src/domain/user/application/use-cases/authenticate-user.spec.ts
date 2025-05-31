import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a user", async () => {
    const hashedPassword = await fakeHasher.hash("123456");

    const newUser = makeUser({
      email: "test@test.com",
      password: hashedPassword,
    });

    await inMemoryUsersRepository.create(newUser);

    const result = await sut.execute({
      email: "test@test.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate a user with wrong credentials", async () => {
    const hashedPassword = await fakeHasher.hash("123456");

    const newUser = makeUser({
      email: "test@test.com",
      password: hashedPassword,
    });

    const result = await sut.execute({
      email: "test@test.com",
      password: "123455",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate a user with wrong email", async () => {
    const result = await sut.execute({
      email: "test@test.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
