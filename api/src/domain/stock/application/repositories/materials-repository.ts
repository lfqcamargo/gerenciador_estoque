import { PaginationParams } from "@/core/repositories/pagination-params";
import { Material } from "@/domain/stock/enterprise/entities/material";

export abstract class MaterialsRepository {
  abstract create(material: Material): Promise<void>;
  abstract findById(id: string): Promise<Material | null>;
  abstract findByName(
    companyId: string,
    name: string
  ): Promise<Material | null>;
  abstract fetchAll(
    companyId: string,
    { page, itemsPerPage }: PaginationParams
  ): Promise<{
    data: Material[] | null;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  } | null>;
  abstract update(material: Material): Promise<void>;
  abstract delete(material: Material): Promise<void>;
}
