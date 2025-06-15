import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Row, RowProps } from "@/domain/stock/enterprise/entities/row";
import { faker } from "@faker-js/faker";

export function makeRow(override: Partial<RowProps> = {}, id?: UniqueEntityID) {
  const row = Row.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return row;
}
