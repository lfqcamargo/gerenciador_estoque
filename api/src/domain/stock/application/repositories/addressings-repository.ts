import { Addressing } from "@/domain/stock/enterprise/entities/addressing";

export abstract class AddressingsRepository {
  abstract create(addressing: Addressing): Promise<void>;
  abstract findById(id: string): Promise<Addressing | null>;
  abstract fetchAll(companyId: string): Promise<Addressing[]>;
  abstract update(addressing: Addressing): Promise<void>;
  abstract delete(addressing: Addressing): Promise<void>;
}
