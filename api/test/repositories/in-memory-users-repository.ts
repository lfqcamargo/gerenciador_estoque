import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User } from "@/domain/user/enterprise/entities/user";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);
    return user ?? null;
  }

  async update(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id === user.id);
    this.items[index] = user;

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}
