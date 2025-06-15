import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  SubLocation,
  SubLocationProps,
} from "@/domain/stock/enterprise/entities/sub-location";
import { faker } from "@faker-js/faker";

export function makeSubLocation(
  override: Partial<SubLocationProps> = {},
  id?: UniqueEntityID
) {
  const sublocation = SubLocation.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      locationId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return sublocation;
}
