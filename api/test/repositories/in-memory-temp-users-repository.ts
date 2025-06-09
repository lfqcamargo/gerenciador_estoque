import { TempUser } from "@/domain/user/enterprise/entities/temp-user";
import { DomainEvents } from "@/core/events/domain-events";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";

export class InMemoryTempUsersRepository implements TempUsersRepository {
  public items: TempUser[] = [];

  async create(tempUser: TempUser): Promise<void> {
    this.items.push(tempUser);

    DomainEvents.dispatchEventsForAggregate(tempUser.id);
  }

  async findByEmail(email: string): Promise<TempUser | null> {
    const tempUser = this.items.find((item) => item.email === email);
    return tempUser ?? null;
  }

  async findByToken(token: string): Promise<TempUser | null> {
    const tempUser = this.items.find((item) => item.token === token);
    return tempUser ?? null;
  }

  async deleteByEmail(email: string): Promise<void> {
    this.items = this.items.filter((item) => item.email !== email);
  }

  async delete(tempUser: TempUser): Promise<void> {
    this.items = this.items.filter((item) => item.id !== tempUser.id);
  }
}
