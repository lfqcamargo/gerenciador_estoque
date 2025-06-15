import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Group, GroupProps } from "@/domain/stock/enterprise/entities/group";
import { faker } from "@faker-js/faker";

export function makeGroup(
  override: Partial<GroupProps> = {},
  id?: UniqueEntityID
) {
  const group = Group.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      name: faker.commerce.product(),
      active: faker.datatype.boolean(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return group;
}
