import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface LocationProps {
  name: string;
  createdAt: Date;
}

export class Location extends AggregateRoot<LocationProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<LocationProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Location(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
