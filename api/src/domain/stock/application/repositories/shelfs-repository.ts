import { PaginationParams } from "@/core/repositories/pagination-params";
import { Shelf } from "@/domain/stock/enterprise/entities/shelf";

export abstract class ShelfsRepository {
  abstract create(shelf: Shelf): Promise<void>;
  abstract findById(id: string): Promise<Shelf | null>;
  abstract findByName(companyId: string, name: string): Promise<Shelf | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Shelf[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(shelf: Shelf): Promise<void>;
  abstract delete(shelf: Shelf): Promise<void>;
}
