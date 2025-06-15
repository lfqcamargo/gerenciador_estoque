import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface SubLocationProps {
  name: string;
  locationId: UniqueEntityID;
  createdAt: Date;
}

export class SubLocation extends AggregateRoot<SubLocationProps> {
  get name() {
    return this.props.name;
  }

  get locationId() {
    return this.props.locationId;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<SubLocationProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new SubLocation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
