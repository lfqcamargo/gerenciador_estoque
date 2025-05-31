import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  User,
  UserProps,
  UserRole,
} from "@/domain/user/enterprise/entities/user";
import { faker } from "@faker-js/faker";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      role: UserRole.ADMIN,
      companyId: faker.string.uuid(),
      createdAt: new Date(),
      lastLogin: new Date(),
      photo: faker.image.url(),
      ...override,
    },
    id
  );

  return user;
}
