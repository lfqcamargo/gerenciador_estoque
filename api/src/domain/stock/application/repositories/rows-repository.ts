import { Row } from "@/domain/stock/enterprise/entities/row";

export abstract class RowsRepository {
  abstract create(row: Row): Promise<void>;
  abstract findById(id: string): Promise<Row | null>;
  abstract findByName(companyId: string, name: string): Promise<Row | null>;
  abstract fetchAll(companyId: string): Promise<Row[]>;
  abstract update(row: Row): Promise<void>;
  abstract delete(row: Row): Promise<void>;
}
