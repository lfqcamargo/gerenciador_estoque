import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "../entities/user";

export class PasswordChangeEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public user: User) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
