import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TempCompany } from "../entities/temp-company";

export class TempCompanyCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public tempCompany: TempCompany) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.tempCompany.id;
  }
}
