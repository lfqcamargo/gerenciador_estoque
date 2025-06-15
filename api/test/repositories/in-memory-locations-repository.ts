import { PaginationParams } from "@/core/repositories/pagination-params";
import { LocationsRepository } from "@/domain/stock/application/repositories/locations-repository";
import { Location } from "@/domain/stock/enterprise/entities/location";

export class InMemoryLocationsRepository implements LocationsRepository {
  public items: Location[] = [];

  async create(location: Location): Promise<void> {
    this.items.push(location);
  }

  async findById(id: string): Promise<Location | null> {
    const location = this.items.find((item) => item.id.toString() === id);
    return location ?? null;
  }

  async findByName(companyId: string, name: string): Promise<Location | null> {
    const location = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return location ?? null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const locations = this.items.filter(
      (item) => item.companyId.toString() === companyId
    );

    const totalItems = locations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedLocations = locations.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const meta = {
      totalItems,
      itemCount: paginatedLocations.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    };

    return {
      data: paginatedLocations.length > 0 ? paginatedLocations : null,
      meta,
    };
  }

  async update(location: Location): Promise<void> {
    const index = this.items.findIndex((item) => item.id === location.id);
    if (index >= 0) {
      this.items[index] = location;
    }
  }

  async delete(location: Location): Promise<void> {
    const index = this.items.findIndex((item) => item.id === location.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
