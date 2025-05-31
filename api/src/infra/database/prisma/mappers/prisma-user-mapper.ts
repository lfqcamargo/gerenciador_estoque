import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/user/enterprise/entities/user";
import { User as PrismaUser } from "generated/prisma";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
        companyId: raw.companyId,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
