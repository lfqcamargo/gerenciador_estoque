import { UsersRepository } from "@/domain/user/application/repositories/users-repository";
import { User } from "@/domain/user/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }
}
