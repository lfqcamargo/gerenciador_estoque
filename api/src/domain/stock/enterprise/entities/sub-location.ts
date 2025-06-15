import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface SubLocationProps {
  companyId: UniqueEntityID;
  locationId: UniqueEntityID;

  name: string;
  active: boolean;
  createdAt: Date;
}

export class SubLocation extends AggregateRoot<SubLocationProps> {
  get companyId() {
    return this.props.companyId;
  }

  get locationId() {
    return this.props.locationId;
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
