import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Location,
  LocationProps,
} from "@/domain/stock/enterprise/entities/location";
import { faker } from "@faker-js/faker";

export function makeLocation(
  override: Partial<LocationProps> = {},
  id?: UniqueEntityID
) {
  const location = Location.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return location;
}
