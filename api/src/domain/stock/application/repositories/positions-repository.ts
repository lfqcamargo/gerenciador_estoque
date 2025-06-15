import { PaginationParams } from "@/core/repositories/pagination-params";
import { Position } from "@/domain/stock/enterprise/entities/position";

export abstract class PositionsRepository {
  abstract create(position: Position): Promise<void>;
  abstract findById(id: string): Promise<Position | null>;
  abstract findByName(
    companyId: string,
    name: string
  ): Promise<Position | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Position[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(position: Position): Promise<void>;
  abstract delete(position: Position): Promise<void>;
}
