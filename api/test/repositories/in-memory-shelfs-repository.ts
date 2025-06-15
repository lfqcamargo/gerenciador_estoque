import { ShelfsRepository } from "@/domain/stock/application/repositories/shelfs-repository";
import { Shelf } from "@/domain/stock/enterprise/entities/shelf";

export class InMemoryShelfsRepository implements ShelfsRepository {
  public items: Shelf[] = [];

  async create(shelf: Shelf): Promise<void> {
    this.items.push(shelf);
  }

  async findById(id: string): Promise<Shelf | null> {
    const shelf = this.items.find((item) => item.id.toString() === id);
    return shelf ?? null;
  }

  async findByName(companyId: string, name: string): Promise<Shelf | null> {
    const shelf = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return shelf ?? null;
  }

  async fetchAll(companyId: string): Promise<Shelf[]> {
    return this.items.filter((item) => item.companyId.toString() === companyId);
  }

  async update(shelf: Shelf): Promise<void> {
    const index = this.items.findIndex((item) => item.id === shelf.id);
    if (index >= 0) {
      this.items[index] = shelf;
    }
  }

  async delete(shelf: Shelf): Promise<void> {
    const index = this.items.findIndex((item) => item.id === shelf.id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }
}
