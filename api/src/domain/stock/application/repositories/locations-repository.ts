import { PaginationParams } from "@/core/repositories/pagination-params";
import { Location } from "@/domain/stock/enterprise/entities/location";

export abstract class LocationsRepository {
  abstract create(location: Location): Promise<void>;
  abstract findById(id: string): Promise<Location | null>;
  abstract findByName(
    companyId: string,
    name: string
  ): Promise<Location | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Location[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(location: Location): Promise<void>;
  abstract delete(location: Location): Promise<void>;
}
