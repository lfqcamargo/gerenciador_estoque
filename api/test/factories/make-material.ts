import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Material,
  MaterialProps,
} from "@/domain/stock/enterprise/entities/material";
import { faker } from "@faker-js/faker";

export function makeMaterial(
  override: Partial<MaterialProps> = {},
  id?: UniqueEntityID
) {
  const material = Material.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      groupId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return material;
}
