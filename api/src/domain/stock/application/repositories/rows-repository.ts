import { PaginationParams } from "@/core/repositories/pagination-params";
import { Row } from "@/domain/stock/enterprise/entities/row";

export abstract class RowsRepository {
  abstract create(row: Row): Promise<void>;
  abstract findById(id: string): Promise<Row | null>;
  abstract findByName(companyId: string, name: string): Promise<Row | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Row[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(row: Row): Promise<void>;
  abstract delete(row: Row): Promise<void>;
}
