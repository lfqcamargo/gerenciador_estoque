import { PaginationParams } from "@/core/repositories/pagination-params";
import { Group } from "@/domain/stock/enterprise/entities/group";

export abstract class GroupsRepository {
  abstract create(group: Group): Promise<void>;
  abstract findById(id: string): Promise<Group | null>;
  abstract findByName(companyId: string, name: string): Promise<Group | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Group[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(group: Group): Promise<void>;
  abstract delete(group: Group): Promise<void>;
}
