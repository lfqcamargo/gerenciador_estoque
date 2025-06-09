import { TempUser } from "@/domain/user/enterprise/entities/temp-user";

export abstract class TempUsersRepository {
  abstract create(tempUser: TempUser): Promise<void>;
  abstract findByEmail(email: string): Promise<TempUser | null>;
  abstract findByToken(token: string): Promise<TempUser | null>;
  abstract delete(tempUser: TempUser): Promise<void>;
  abstract deleteByEmail(email: string): Promise<void>;
}
