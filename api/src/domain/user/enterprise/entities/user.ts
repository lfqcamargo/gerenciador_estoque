import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { PasswordChangeEvent } from "../events/password-change.event";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface UserProps {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  photo?: string | null;
  createdAt: Date;
  lastLogin?: Date | null;

  companyId: string;
}

export class User extends AggregateRoot<UserProps> {
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

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;

    this.addDomainEvent(new PasswordChangeEvent(this));
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    this.props.role = role;
  }

  get photo() {
    return this.props.photo;
  }

  set photo(photo: string | null | undefined) {
    this.props.photo = photo;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get lastLogin() {
    if (!this.props.lastLogin) {
      return null;
    }

    return this.props.lastLogin;
  }

  set lastLogin(lastLogin: Date | null | undefined) {
    this.props.lastLogin = lastLogin;
  }

  get companyId() {
    return this.props.companyId;
  }

  isAdmin() {
    return this.props.role === UserRole.ADMIN;
  }

  static create(props: Optional<UserProps, "createdAt">, id?: UniqueEntityID) {
    const user = new User({ ...props, createdAt: new Date() }, id);

    return user;
  }
}
