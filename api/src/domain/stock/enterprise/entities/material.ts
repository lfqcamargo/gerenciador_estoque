import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MaterialProps {
  companyId: UniqueEntityID;
  groupId: UniqueEntityID;

  name: string;
  active: boolean;
  createdAt: Date;
}

export class Material extends AggregateRoot<MaterialProps> {
  get companyId() {
    return this.props.companyId;
  }

  get groupId() {
    return this.props.groupId;
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
