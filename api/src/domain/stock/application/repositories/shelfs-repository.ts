import { Shelf } from "@/domain/stock/enterprise/entities/shelf";

export abstract class ShelfsRepository {
  abstract create(shelf: Shelf): Promise<void>;
  abstract findById(id: string): Promise<Shelf | null>;
  abstract findByName(companyId: string, name: string): Promise<Shelf | null>;
  abstract fetchAll(companyId: string): Promise<Shelf[]>;
  abstract update(shelf: Shelf): Promise<void>;
  abstract delete(shelf: Shelf): Promise<void>;
}
