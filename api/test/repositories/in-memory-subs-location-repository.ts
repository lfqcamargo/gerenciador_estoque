import { PaginationParams } from "@/core/repositories/pagination-params";
import { SubsLocationRepository } from "@/domain/stock/application/repositories/subs-location-repository";
import { SubLocation } from "@/domain/stock/enterprise/entities/sub-location";

export class InMemorySubsLocationRepository implements SubsLocationRepository {
  public items: SubLocation[] = [];

  async create(sublocation: SubLocation): Promise<void> {
    this.items.push(sublocation);
  }

  async findById(id: string): Promise<SubLocation | null> {
    const sublocation = this.items.find((item) => item.id.toString() === id);
    return sublocation ?? null;
  }

  async findByName(
    companyId: string,
    locationId: string,
    name: string
  ): Promise<SubLocation | null> {
    const sublocation = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.locationId.toString() === locationId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return sublocation ?? null;
  }

  async fetchAll(
    companyId: string,
    locationId: string,
    { page, itemsPerPage }: PaginationParams
  ) {
    const sublocation = this.items.filter(
      (item) =>
        item.companyId.toString() === companyId &&
        item.locationId.toString() === locationId
    );

    const totalItems = sublocation.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedSubLocation = sublocation.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const meta = {
      totalItems,
      itemCount: paginatedSubLocation.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    };

    return {
      data: paginatedSubLocation.length > 0 ? paginatedSubLocation : null,
      meta,
    };
  }

  async update(sublocation: SubLocation): Promise<void> {
    const index = this.items.findIndex((item) => item.id === sublocation.id);
    if (index >= 0) {
      this.items[index] = sublocation;
    }
  }

  async delete(sublocation: SubLocation): Promise<void> {
    const index = this.items.findIndex((item) => item.id === sublocation.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
