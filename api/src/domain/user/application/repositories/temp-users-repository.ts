import { TempUser } from "@/domain/user/enterprise/entities/temp_user";

export abstract class TempUsersRepository {
  abstract create(tempUser: TempUser): Promise<void>;
  abstract findByEmail(email: string): Promise<TempUser | null>;
  abstract findByCnpj(cnpj: string): Promise<TempUser | null>;
  abstract findByToken(token: string): Promise<TempUser | null>;
  abstract delete(id: string): Promise<void>;
}
