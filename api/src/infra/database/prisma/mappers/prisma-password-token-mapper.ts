import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";
import { PasswordToken as PrismaPasswordToken, Prisma } from "generated/prisma";

export class PrismaPasswordTokenMapper {
  static toDomain(raw: PrismaPasswordToken): PasswordToken {
    return PasswordToken.create(
      {
        token: raw.token,
        expiration: raw.expiration,
        userId: raw.userId,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    passwordToken: PasswordToken
  ): Prisma.PasswordTokenUncheckedCreateInput {
    return {
      id: passwordToken.id.toString(),
      token: passwordToken.token,
      expiration: passwordToken.expiration,
      userId: passwordToken.userId,
    };
  }
}
