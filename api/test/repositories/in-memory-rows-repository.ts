import { RowsRepository } from "@/domain/stock/application/repositories/rows-repository";
import { Row } from "@/domain/stock/enterprise/entities/row";

export class InMemoryRowsRepository implements RowsRepository {
  public items: Row[] = [];

  async create(row: Row): Promise<void> {
    this.items.push(row);
  }

  async findById(id: string): Promise<Row | null> {
    const row = this.items.find((item) => item.id.toString() === id);
    return row ?? null;
  }

  async findByName(companyId: string, name: string): Promise<Row | null> {
    const row = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return row ?? null;
  }

  async fetchAll(companyId: string): Promise<Row[]> {
    return this.items.filter((item) => item.companyId.toString() === companyId);
  }

  async update(row: Row): Promise<void> {
    const index = this.items.findIndex((item) => item.id === row.id);
    if (index >= 0) {
      this.items[index] = row;
    }
  }

  async delete(row: Row): Promise<void> {
    const index = this.items.findIndex((item) => item.id === row.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
