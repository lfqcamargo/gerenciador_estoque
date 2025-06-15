import { Material } from "@/domain/stock/enterprise/entities/material";

export abstract class MaterialsRepository {
  abstract create(material: Material): Promise<void>;
  abstract findById(id: string): Promise<Material | null>;
  abstract findByName(
    companyId: string,
    name: string
  ): Promise<Material | null>;
  abstract fetchAll(companyId: string): Promise<Material[]>;
  abstract update(material: Material): Promise<void>;
  abstract delete(material: Material): Promise<void>;
}
