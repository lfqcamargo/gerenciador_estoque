import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Addressing,
  AddressingProps,
} from "@/domain/stock/enterprise/entities/addressing";
import { faker } from "@faker-js/faker";

export function makeAddressing(
  override: Partial<AddressingProps> = {},
  id?: UniqueEntityID
) {
  const addressing = Addressing.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      locationId: new UniqueEntityID(faker.string.uuid()),
      subLocationId: new UniqueEntityID(faker.string.uuid()),
      rowId: new UniqueEntityID(faker.string.uuid()),
      shelfId: new UniqueEntityID(faker.string.uuid()),
      positionId: new UniqueEntityID(faker.string.uuid()),
      materialId: new UniqueEntityID(faker.string.uuid()),
      amount: faker.number.float(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return addressing;
}
