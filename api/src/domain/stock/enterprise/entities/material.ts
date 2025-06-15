import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MaterialProps {
  name: string;
  groupId: UniqueEntityID;
  createdAt: Date;
}

export class Material extends AggregateRoot<MaterialProps> {
  get name() {
    return this.props.name;
  }

  get groupId() {
    return this.props.groupId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set name(value: string) {
    this.props.name = value;
  }

  static create(
    props: Optional<MaterialProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Material(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
