import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface PositionProps {
  name: string;
  shelfId: UniqueEntityID;
  createdAt: Date;
}

export class Position extends AggregateRoot<PositionProps> {
  get name() {
    return this.props.name;
  }

  get shelfId() {
    return this.props.shelfId;
  }

  set name(value: string) {
    this.props.name = value;
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
