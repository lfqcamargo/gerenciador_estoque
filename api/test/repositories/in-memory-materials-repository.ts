import { PaginationParams } from "@/core/repositories/pagination-params";
import { MaterialsRepository } from "@/domain/stock/application/repositories/materials-repository";
import { Material } from "@/domain/stock/enterprise/entities/material";

export class InMemoryMaterialsRepository implements MaterialsRepository {
  public items: Material[] = [];

  async create(material: Material): Promise<void> {
    this.items.push(material);
  }

  async findById(id: string): Promise<Material | null> {
    const material = this.items.find((item) => item.id.toString() === id);
    return material ?? null;
  }

  async findByName(companyId: string, name: string): Promise<Material | null> {
    const material = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return material ?? null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const materials = this.items.filter(
      (item) => item.companyId.toString() === companyId
    );

    const totalItems = materials.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedMaterials = materials.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const meta = {
      totalItems,
      itemCount: paginatedMaterials.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    };

    return {
      data: paginatedMaterials.length > 0 ? paginatedMaterials : null,
      meta,
    };
  }

  async update(material: Material): Promise<void> {
    const index = this.items.findIndex((item) => item.id === material.id);
    if (index >= 0) {
      this.items[index] = material;
    }
  }

  async delete(material: Material): Promise<void> {
    const index = this.items.findIndex((item) => item.id === material.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
