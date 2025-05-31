import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PasswordToken } from "../entities/passwordToken";
import { User } from "../entities/user";

export class PasswordTokenCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(
    public passwordToken: PasswordToken,
    public user: User
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.passwordToken.id;
  }
}
