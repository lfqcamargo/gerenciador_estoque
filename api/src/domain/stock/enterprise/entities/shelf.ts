import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ShelfProps {
  name: string;
  rowId: UniqueEntityID;
  createdAt: Date;
}

export class Shelf extends AggregateRoot<ShelfProps> {
  get name() {
    return this.props.name;
  }

  get rowId() {
    return this.props.rowId;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<ShelfProps, "createdAt">, id?: UniqueEntityID) {
    return new Shelf(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
