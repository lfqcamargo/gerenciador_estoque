import { Position } from "@/domain/stock/enterprise/entities/position";

export abstract class PositionsRepository {
  abstract create(position: Position): Promise<void>;
  abstract findById(id: string): Promise<Position | null>;
  abstract findByName(
    companyId: string,
    name: string
  ): Promise<Position | null>;
  abstract fetchAll(companyId: string): Promise<Position[]>;
  abstract update(position: Position): Promise<void>;
  abstract delete(position: Position): Promise<void>;
}
