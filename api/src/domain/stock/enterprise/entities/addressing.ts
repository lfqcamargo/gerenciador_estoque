import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AddressingProps {
  companyId: UniqueEntityID;
  locationId: UniqueEntityID;
  subLocationId: UniqueEntityID;
  rowId: UniqueEntityID;
  shelfId: UniqueEntityID;
  positionId: UniqueEntityID;
  materialId: UniqueEntityID;

  amount: number;
  active: boolean;
  createdAt: Date;
}

export class Addressing extends AggregateRoot<AddressingProps> {
  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get locationId(): UniqueEntityID {
    return this.props.locationId;
  }

  get subLocationId(): UniqueEntityID {
    return this.props.subLocationId;
  }

  get rowId(): UniqueEntityID {
    return this.props.rowId;
  }

  get shelfId(): UniqueEntityID {
    return this.props.shelfId;
  }

  get positionId(): UniqueEntityID {
    return this.props.positionId;
  }

  get materialId(): UniqueEntityID {
    return this.props.materialId;
  }

  get amount(): number {
    return this.props.amount;
  }

  set amount(value: number) {
    this.props.amount = value;
  }

  get active(): boolean {
    return this.props.active;
  }

  set active(value: boolean) {
    this.props.active = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Optional<AddressingProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Addressing(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
