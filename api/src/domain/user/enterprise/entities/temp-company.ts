import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TempCompanyCreatedEvent } from "../events/temp-company-created.event";

export interface TempCompanyProps {
  cnpj: string;
  companyName: string;
  email: string;
  userName: string;
  password: string;
  token: string;
  expiration: Date;
}

export class TempCompany extends AggregateRoot<TempCompanyProps> {
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

  static create(props: TempCompanyProps, id?: UniqueEntityID) {
    const tempCompany = new TempCompany({ ...props }, id);

    const isNewTempCompany = !id;

    if (isNewTempCompany) {
      tempCompany.addDomainEvent(new TempCompanyCreatedEvent(tempCompany));
    }

    return tempCompany;
  }
}
