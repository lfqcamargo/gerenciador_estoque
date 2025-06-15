import { PaginationParams } from "@/core/repositories/pagination-params";
import { AddressingsRepository } from "@/domain/stock/application/repositories/addressings-repository";
import { Addressing } from "@/domain/stock/enterprise/entities/addressing";

export class InMemoryAddressingsRepository implements AddressingsRepository {
  public items: Addressing[] = [];

  async create(addressing: Addressing): Promise<void> {
    this.items.push(addressing);
  }

  async findById(id: string): Promise<Addressing | null> {
    const addressing = this.items.find((item) => item.id.toString() === id);
    return addressing ?? null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const addressings = this.items.filter(
      (item) => item.companyId.toString() === companyId
    );

    const totalItems = addressings.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedAddressings = addressings.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const meta = {
      totalItems,
      itemCount: paginatedAddressings.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    };

    return {
      data: paginatedAddressings.length > 0 ? paginatedAddressings : null,
      meta,
    };
  }

  async update(addressing: Addressing): Promise<void> {
    const index = this.items.findIndex((item) => item.id === addressing.id);
    if (index >= 0) {
      this.items[index] = addressing;
    }
  }

  async delete(addressing: Addressing): Promise<void> {
    const index = this.items.findIndex((item) => item.id === addressing.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
