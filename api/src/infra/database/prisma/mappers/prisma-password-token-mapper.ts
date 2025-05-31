import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PasswordToken } from "@/domain/user/enterprise/entities/passwordToken";
import { PasswordToken as PrismaPasswordToken } from "generated/prisma";
import { PrismaUserMapper } from "./prisma-user-mapper";

export class PrismaPasswordTokenMapper {
  static toDomain(raw: PrismaPasswordToken): PasswordToken {
    return PasswordToken.create(
      {
        token: raw.token,
        expiration: raw.expiration,
        user: raw.userId,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
