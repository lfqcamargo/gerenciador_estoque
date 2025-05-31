import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TempUserCreatedEvent } from "../events/temp-user-created.event";

export interface TempUserProps {
  cnpj: string;
  companyName: string;
  email: string;
  userName: string;
  password: string;
  token: string;
  expiration: Date;
}

export class TempUser extends AggregateRoot<TempUserProps> {
  get cnpj() {
    return this.props.cnpj;
  }

  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj;
  }

  get companyName() {
    return this.props.companyName;
  }

  set companyName(companyName: string) {
    this.props.companyName = companyName;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get userName() {
    return this.props.userName;
  }

  set userName(userName: string) {
    this.props.userName = userName;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
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
