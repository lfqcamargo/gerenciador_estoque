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

  async fetchAll(companyId: string): Promise<Location[]> {
    return this.items.filter((item) => item.companyId.toString() === companyId);
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
