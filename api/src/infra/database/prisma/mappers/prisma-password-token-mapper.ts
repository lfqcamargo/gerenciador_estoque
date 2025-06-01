import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";
import { Prisma, PasswordToken as PrismaPasswordToken } from "generated/prisma";

export class PrismaPasswordTokenMapper {
  static toDomain(raw: PrismaPasswordToken): PasswordToken {
    return PasswordToken.create(
      {
        userId: raw.userId,
        token: raw.token,
        expiration: raw.expiration,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    passwordToken: PasswordToken
  ): Prisma.PasswordTokenUncheckedCreateInput {
    return {
      id: passwordToken.id.toString(),
      userId: passwordToken.userId,
      token: passwordToken.token,
      expiration: passwordToken.expiration,
    };
  }
}
