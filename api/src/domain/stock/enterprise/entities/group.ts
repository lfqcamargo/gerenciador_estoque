import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface GroupProps {
  companyId: UniqueEntityID;
  name: string;
  active: boolean;
  createdAt: Date;
}

export class Group extends AggregateRoot<GroupProps> {
  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get active(): boolean {
    return this.props.active;
  }

  set active(value: boolean) {
    this.props.active = value;
  }

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: Optional<GroupProps, "createdAt">, id?: UniqueEntityID) {
    return new Group(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
