import { Injectable } from "@nestjs/common";
import { TempUsersRepository } from "@/domain/user/application/repositories/temp-users-repository";
import { TempUser } from "@/domain/user/enterprise/entities/tempUser";

@Injectable()
export class PrismaTempUsersRepository implements TempUsersRepository {
  create(tempUser: TempUser): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<TempUser | null> {
    throw new Error("Method not implemented.");
  }
  findByCnpj(cnpj: string): Promise<TempUser | null> {
    throw new Error("Method not implemented.");
  }
  findByToken(token: string): Promise<TempUser | null> {
    throw new Error("Method not implemented.");
  }
  delete(tempUser: TempUser): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteByCnpj(cnpj: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
