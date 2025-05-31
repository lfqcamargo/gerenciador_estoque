import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TempUser } from "@/domain/user/enterprise/entities/tempUser";
import { TempUser as PrismaTempUser, Prisma } from "generated/prisma";

export class PrismaTempUserMapper {
  static toDomain(raw: PrismaTempUser): TempUser {
    return TempUser.create(
      {
        userName: raw.userName,
        email: raw.email,
        password: raw.password,
        companyName: raw.companyName,
        cnpj: raw.cnpj,
        token: raw.token,
        expiration: raw.expiration,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(tempUser: TempUser): Prisma.TempUserUncheckedCreateInput {
    return {
      id: tempUser.id.toString(),
      userName: tempUser.userName,
      email: tempUser.email,
      password: tempUser.password,
      companyName: tempUser.companyName,
      cnpj: tempUser.cnpj,
      token: tempUser.token,
      expiration: tempUser.expiration,
    };
  }
}
