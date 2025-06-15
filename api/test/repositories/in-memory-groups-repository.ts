import { GroupsRepository } from "@/domain/stock/application/repositories/groups-repository";
import { Group } from "@/domain/stock/enterprise/entities/group";
import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";

export class InMemoryGroupsRepository implements GroupsRepository {
  public items: Group[] = [];

  async create(group: Group): Promise<void> {
    this.items.push(group);
  }

  async findById(id: string): Promise<Group | null> {
    const group = this.items.find((item) => item.id.toString() === id);
    return group ?? null;
  }

  async findByName(companyId: string, name: string): Promise<Group | null> {
    const group = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return group ?? null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const groups = this.items.filter(
      (item) => item.companyId.toString() === companyId
    );

    const totalItems = groups.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedGroups = groups.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const meta = {
      totalItems,
      itemCount: paginatedGroups.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    };

    return {
      data: paginatedGroups.length > 0 ? paginatedGroups : null,
      meta,
    };
  }

  async update(group: Group): Promise<void> {
    const index = this.items.findIndex((item) => item.id === group.id);
    if (index >= 0) {
      this.items[index] = group;
    }
  }

  async delete(group: Group): Promise<void> {
    const index = this.items.findIndex((item) => item.id === group.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
