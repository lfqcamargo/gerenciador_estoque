import { PaginationParams } from "@/core/repositories/pagination-params";
import { PositionsRepository } from "@/domain/stock/application/repositories/positions-repository";
import { Position } from "@/domain/stock/enterprise/entities/position";

export class InMemoryPositionsRepository implements PositionsRepository {
  public items: Position[] = [];

  async create(position: Position): Promise<void> {
    this.items.push(position);
  }

  async findById(id: string): Promise<Position | null> {
    const position = this.items.find((item) => item.id.toString() === id);
    return position ?? null;
  }

  async findByName(companyId: string, name: string): Promise<Position | null> {
    const position = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return position ?? null;
  }

  async fetchAll(companyId: string, { page, itemsPerPage }: PaginationParams) {
    const positions = this.items.filter(
      (item) => item.companyId.toString() === companyId
    );

    const totalItems = positions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedPositions = positions.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const meta = {
      totalItems,
      itemCount: paginatedPositions.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    };

    return {
      data: paginatedPositions.length > 0 ? paginatedPositions : null,
      meta,
    };
  }

  async update(position: Position): Promise<void> {
    const index = this.items.findIndex((item) => item.id === position.id);
    if (index >= 0) {
      this.items[index] = position;
    }
  }

  async delete(position: Position): Promise<void> {
    const index = this.items.findIndex((item) => item.id === position.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
