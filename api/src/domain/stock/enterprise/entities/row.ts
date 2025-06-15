import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface RowProps {
  name: string;
  subLocationId: UniqueEntityID;
  createdAt: Date;
}

export class Row extends AggregateRoot<RowProps> {
  get name() {
    return this.props.name;
  }

  get subLocationId() {
    return this.props.subLocationId;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<RowProps, "createdAt">, id?: UniqueEntityID) {
    return new Row(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
