import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  PasswordToken,
  PasswordTokenProps,
} from "@/domain/user/enterprise/entities/passwordToken";
import { faker } from "@faker-js/faker";
import { makeUser } from "./make-user";
export function makePasswordToken(
  override: Partial<PasswordTokenProps> = {},
  id?: UniqueEntityID
) {
  const passwordToken = PasswordToken.create(
    {
      token: faker.string.uuid(),
      expiration: faker.date.future(),
      userId: makeUser().id.toString(),
      ...override,
    },
    id
  );

  return passwordToken;
}
