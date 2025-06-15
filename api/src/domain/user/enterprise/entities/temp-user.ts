import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UserRole } from "./user";
import { TempUserCreatedEvent } from "../events/temp-user-created.event";

export interface TempUserProps {
  companyId: UniqueEntityID;
  email: string;
  name: string;
  userRole: UserRole;
  token: string;
  expiration: Date;
}

export class TempUser extends AggregateRoot<TempUserProps> {
  get companyId() {
    return this.props.companyId;
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get userRole() {
    return this.props.userRole;
  }

  set userRole(userRole: UserRole) {
    this.props.userRole = userRole;
  }

  get token() {
    return this.props.token;
  }

  set token(token: string) {
    this.props.token = token;
  }

  get expiration() {
    return this.props.expiration;
  }

  set expiration(expiration: Date) {
    this.props.expiration = expiration;
  }

  static create(props: TempUserProps, id?: UniqueEntityID) {
    const tempUser = new TempUser({ ...props }, id);

    const isNewTempUser = !id;

    if (isNewTempUser) {
      tempUser.addDomainEvent(new TempUserCreatedEvent(tempUser));
    }

    return tempUser;
  }
}
