import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Company } from "../entities/company";

export class CompanyCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public company: Company) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.company.id;
  }
}
