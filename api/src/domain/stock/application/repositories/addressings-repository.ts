import { PaginationParams } from "@/core/repositories/pagination-params";
import { Addressing } from "@/domain/stock/enterprise/entities/addressing";

export abstract class AddressingsRepository {
  abstract create(addressing: Addressing): Promise<void>;
  abstract findById(id: string): Promise<Addressing | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Addressing[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(addressing: Addressing): Promise<void>;
  abstract delete(addressing: Addressing): Promise<void>;
}
