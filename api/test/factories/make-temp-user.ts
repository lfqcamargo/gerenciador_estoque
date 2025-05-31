import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  TempUser,
  TempUserProps,
} from "@/domain/user/enterprise/entities/temp_user";
import { faker } from "@faker-js/faker";
import { makeUser } from "./make-user";
export function makeTempUser(
  override: Partial<TempUserProps> = {},
  id?: UniqueEntityID
) {
  const tempUser = TempUser.create(
    {
      cnpj: faker.string.numeric(14),
      companyName: faker.company.name(),
      email: faker.internet.email(),
      userName: faker.person.fullName(),
      password: faker.internet.password(),
      token: faker.string.uuid(),
      expiration: faker.date.future(),
      ...override,
    },
    id
  );

  return tempUser;
}
