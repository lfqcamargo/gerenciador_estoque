import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  TempCompany,
  TempCompanyProps,
} from "@/domain/user/enterprise/entities/temp-company";
import { faker } from "@faker-js/faker";

export function makeTempCompany(
  override: Partial<TempCompanyProps> = {},
  id?: UniqueEntityID
) {
  const tempCompany = TempCompany.create(
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

  return tempCompany;
}
