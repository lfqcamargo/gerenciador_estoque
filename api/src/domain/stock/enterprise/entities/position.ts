import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface PositionProps {
  companyId: UniqueEntityID;

  name: string;
  active: boolean;
  createdAt: Date;
}

export class Position extends AggregateRoot<PositionProps> {
  get companyId() {
    return this.props.companyId;
  }

  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get active() {
    return this.props.active;
  }

  set active(value: boolean) {
    this.props.active = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<PositionProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Position(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
