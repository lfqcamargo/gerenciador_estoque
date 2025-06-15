import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Position,
  PositionProps,
} from "@/domain/stock/enterprise/entities/position";
import { faker } from "@faker-js/faker";

export function makePosition(
  override: Partial<PositionProps> = {},
  id?: UniqueEntityID
) {
  const position = Position.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return position;
}
