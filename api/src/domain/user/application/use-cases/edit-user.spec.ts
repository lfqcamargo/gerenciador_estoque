import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { EditUserUseCase } from "./edit-user";
import { makeUser } from "test/factories/make-user";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UserNotAdminError } from "./errors/user-not-admin-error";
import { UserRole } from "../../enterprise/entities/user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditUserUseCase;

describe("Edit User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditUserUseCase(inMemoryUsersRepository);
  });

  it("should allow user to edit their own name and photo", async () => {
    const user = makeUser();
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      authenticateUserId: user.id.toString(),
      name: "Updated Name",
      role: user.role,
      active: user.active,
      photoId: "new-photo-id",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.name).toBe("Updated Name");
      expect(result.value.user.photoId).toBe("new-photo-id");
    }
  });

  it("should allow admin to edit another user including role and active", async () => {
    const admin = makeUser({ role: UserRole.ADMIN });
    const targetUser = makeUser({ role: UserRole.EMPLOYEE, active: true });

    await inMemoryUsersRepository.create(admin);
    await inMemoryUsersRepository.create(targetUser);

    const result = await sut.execute({
      userId: targetUser.id.toString(),
      authenticateUserId: admin.id.toString(),
      name: "Changed Name",
      role: UserRole.ADMIN,
      active: false,
      photoId: "new-photo-id",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.name).toBe("Changed Name");
      expect(result.value.user.role).toBe(UserRole.ADMIN);
      expect(result.value.user.active).toBe(false);
    }
  });

  it("should not allow non-admin user to edit another user", async () => {
    const user1 = makeUser({ role: UserRole.EMPLOYEE });
    const user2 = makeUser({ role: UserRole.EMPLOYEE });

    await inMemoryUsersRepository.create(user1);
    await inMemoryUsersRepository.create(user2);

    const result = await sut.execute({
      userId: user2.id.toString(),
      authenticateUserId: user1.id.toString(),
      name: "New Name",
      role: UserRole.ADMIN,
      active: true,
      photoId: null,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotAdminError);
  });

  it("should return error if user to edit is not found", async () => {
    const admin = makeUser({ role: UserRole.ADMIN });
    await inMemoryUsersRepository.create(admin);

    const result = await sut.execute({
      userId: "non-existent-id",
      authenticateUserId: admin.id.toString(),
      name: "Name",
      role: UserRole.EMPLOYEE,
      active: true,
      photoId: null,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should return error if authenticated user is not found", async () => {
    const targetUser = makeUser();
    await inMemoryUsersRepository.create(targetUser);

    const result = await sut.execute({
      userId: targetUser.id.toString(),
      authenticateUserId: "non-existent-id",
      name: "Name",
      role: UserRole.EMPLOYEE,
      active: true,
      photoId: null,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
