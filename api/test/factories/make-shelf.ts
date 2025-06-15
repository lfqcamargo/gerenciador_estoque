import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Shelf, ShelfProps } from "@/domain/stock/enterprise/entities/shelf";
import { faker } from "@faker-js/faker";

export function makeShelf(
  override: Partial<ShelfProps> = {},
  id?: UniqueEntityID
) {
  const shelf = Shelf.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return shelf;
}
