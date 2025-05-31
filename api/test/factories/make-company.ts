import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Company,
  CompanyProps,
} from "@/domain/user/enterprise/entities/company";
import { faker } from "@faker-js/faker";

export function makeCompany(
  override: Partial<CompanyProps> = {},
  id?: UniqueEntityID
) {
  const company = Company.create(
    {
      name: faker.company.name(),
      cnpj: faker.string.numeric(14),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return company;
}
