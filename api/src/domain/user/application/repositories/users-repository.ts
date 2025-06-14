import { User } from "@/domain/user/enterprise/entities/user";

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract fetchAll(companyId: string): Promise<User[]>;
  abstract update(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
