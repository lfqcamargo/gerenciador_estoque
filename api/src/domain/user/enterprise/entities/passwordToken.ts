import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "./user";
import { PasswordTokenCreatedEvent } from "../events/password-token-created.event";

export interface PasswordTokenProps {
  token: string;
  expiration: Date;
  userId: string;
}

export class PasswordToken extends AggregateRoot<PasswordTokenProps> {
  get token() {
    return this.props.token;
  }

  get expiration() {
    return this.props.expiration;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: PasswordTokenProps, id?: UniqueEntityID) {
    const passwordToken = new PasswordToken(props, id);

    passwordToken.addDomainEvent(
      new PasswordTokenCreatedEvent(passwordToken, props.userId)
    );

    return passwordToken;
  }
}
