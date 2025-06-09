import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  TempUser,
  TempUserProps,
} from "@/domain/user/enterprise/entities/temp-user";
import { UserRole } from "@/domain/user/enterprise/entities/user";
import { faker } from "@faker-js/faker";

export function makeTempUser(
  override: Partial<TempUserProps> = {},
  id?: UniqueEntityID
) {
  const tempUser = TempUser.create(
    {
      companyId: faker.string.uuid(),
      email: faker.internet.email(),
      userName: faker.person.fullName(),
      userRole: UserRole.ADMIN,
      token: faker.string.uuid(),
      expiration: faker.date.future(),
      ...override,
    },
    id
  );

  return tempUser;
}
