import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface EmailProps {
  to: string;
  subject: string;
  body: string;
  from?: string;
  createdAt: Date;
  sentAt?: Date;
}

export class Email extends Entity<EmailProps> {
  get to() {
    return this.props.to;
  }

  get subject() {
    return this.props.subject;
  }

  get body() {
    return this.props.body;
  }

  get from() {
    return this.props.from;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get sentAt() {
    return this.props.sentAt;
  }

  markAsSent() {
    this.props.sentAt = new Date();
  }

  static create(props: Optional<EmailProps, "createdAt">, id?: UniqueEntityID) {
    const email = new Email({ ...props, createdAt: new Date() }, id);

    return email;
  }
}
