import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface RowProps {
  companyId: UniqueEntityID;

  name: string;
  active: boolean;
  createdAt: Date;
}

export class Row extends AggregateRoot<RowProps> {
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
