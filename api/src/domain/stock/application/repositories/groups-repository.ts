import { Group } from "@/domain/stock/enterprise/entities/group";

export abstract class GroupsRepository {
  abstract create(group: Group): Promise<void>;
  abstract findById(id: string): Promise<Group | null>;
  abstract findByName(companyId: string, name: string): Promise<Group | null>;
  abstract fetchAll(companyId: string): Promise<Group[]>;
  abstract update(group: Group): Promise<void>;
  abstract delete(group: Group): Promise<void>;
}
