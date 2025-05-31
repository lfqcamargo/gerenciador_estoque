import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { User } from "./user";
import { CompanyCreatedEvent } from "../events/company-created.event";

export interface CompanyProps {
  cnpj: string;
  name: string;
  createdAt: Date;
  users: User[];
}

export class Company extends AggregateRoot<CompanyProps> {
  get cnpj() {
    return this.props.cnpj;
  }

  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get users() {
    return this.props.users;
  }

  set users(users: User[]) {
    this.props.users = users;
  }

  static create(
    props: Optional<CompanyProps, "createdAt" | "users">,
    id?: UniqueEntityID
  ) {
    const company = new Company(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        users: props.users ?? [],
      },
      id
    );

    const isNewCompany = !id;

    if (isNewCompany) {
      company.addDomainEvent(new CompanyCreatedEvent(company));
    }

    return company;
  }
}
