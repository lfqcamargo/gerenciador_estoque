import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TempUser } from "../entities/temp_user";

export class TempUserCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public tempUser: TempUser) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.tempUser.id;
  }
}
