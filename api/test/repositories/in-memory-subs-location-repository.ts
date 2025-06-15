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
    name: string
  ): Promise<SubLocation | null> {
    const sublocation = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toLowerCase() === name.toLowerCase()
    );
    return sublocation ?? null;
  }

  async fetchAll(companyId: string): Promise<SubLocation[]> {
    return this.items.filter((item) => item.companyId.toString() === companyId);
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
