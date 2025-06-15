import { PaginationParams } from "@/core/repositories/pagination-params";
import { SubLocation } from "@/domain/stock/enterprise/entities/sub-location";

export abstract class SubsLocationRepository {
  abstract create(sublocation: SubLocation): Promise<void>;
  abstract findById(id: string): Promise<SubLocation | null>;
  abstract findByName(
    companyId: string,
    locationId: string,
    name: string
  ): Promise<SubLocation | null>;
  abstract fetchAll(
    companyId: string,
    locationId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: SubLocation[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(sublocation: SubLocation): Promise<void>;
  abstract delete(sublocation: SubLocation): Promise<void>;
}
